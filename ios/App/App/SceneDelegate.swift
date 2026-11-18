import UIKit
import Capacitor

class SceneDelegate: UIResponder, UIWindowSceneDelegate {
    var window: UIWindow?

    func scene(_ scene: UIScene, willConnectTo session: UISceneSession, options connectionOptions: UIScene.ConnectionOptions) {
        guard let windowScene = scene as? UIWindowScene else { return }

        window = UIWindow(windowScene: windowScene)
        window?.rootViewController = MainViewController()
        window?.makeKeyAndVisible()

        SceneDelegateProxy.shared.scene(scene, willConnectTo: session, options: connectionOptions)
    }

    func scene(_ scene: UIScene, openURLContexts URLContexts: Set<UIOpenURLContext>) {
        SceneDelegateProxy.shared.scene(scene, openURLContexts: URLContexts)
    }

    func scene(_ scene: UIScene, continue userActivity: NSUserActivity) {
        SceneDelegateProxy.shared.scene(scene, continue: userActivity)
    }
}


// MARK: - Studio Typo: native Liquid Glass tab bar

/// Bridge view controller that registers the app's own native plugins.
class MainViewController: CAPBridgeViewController {
    override func capacitorDidLoad() {
        bridge?.registerPluginInstance(GlassTabBarPlugin())
    }
}

/// Shows the bottom tab bar as a real system Liquid Glass view (iOS 26+), placed exactly over the web tab bar.
/// Falls back to a system material blur on older iOS versions.
@objc(GlassTabBarPlugin)
public class GlassTabBarPlugin: CAPPlugin, CAPBridgedPlugin {
    public let identifier = "GlassTabBarPlugin"
    public let jsName = "GlassTabBar"
    public let pluginMethods: [CAPPluginMethod] = [
        CAPPluginMethod(name: "show", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "hide", returnType: CAPPluginReturnPromise)
    ]
    private var bar: GlassBarView?

    private func num(_ v: JSValue?) -> CGFloat {
        if let d = v as? Double { return CGFloat(d) }
        if let i = v as? Int { return CGFloat(i) }
        if let n = v as? NSNumber { return CGFloat(truncating: n) }
        return 0
    }

    @objc func show(_ call: CAPPluginCall) {
        let raw = call.getArray("items", JSObject.self) ?? []
        let items: [(String, String, String)] = raw.map { o in
            ((o["id"] as? String) ?? "", (o["label"] as? String) ?? "", (o["icon"] as? String) ?? "circle")
        }
        let selected = call.getString("selected") ?? ""
        let f = call.getObject("frame") ?? [:]
        let rect = CGRect(x: num(f["x"]), y: num(f["y"]), width: num(f["w"]), height: num(f["h"]))
        DispatchQueue.main.async {
            guard let vc = self.bridge?.viewController, let web = self.bridge?.webView, rect.width > 10, rect.height > 10 else {
                call.resolve(); return
            }
            if self.bar == nil {
                let b = GlassBarView(frame: .zero)
                b.onTap = { [weak self] id in self?.notifyListeners("tap", data: ["id": id]) }
                vc.view.addSubview(b)
                self.bar = b
            }
            guard let bar = self.bar else { call.resolve(); return }
            let target = web.convert(rect, to: vc.view)
            let wasHidden = bar.isHidden
            bar.isHidden = false
            bar.update(items: items, selected: selected, frame: target, in: vc.view)
            vc.view.bringSubviewToFront(bar)
            if wasHidden { bar.alpha = 0; UIView.animate(withDuration: 0.18) { bar.alpha = 1 } }
            call.resolve()
        }
    }

    @objc func hide(_ call: CAPPluginCall) {
        DispatchQueue.main.async {
            self.bar?.isHidden = true
            call.resolve()
        }
    }
}

final class GlassBarView: UIView, UITabBarDelegate {
    var onTap: ((String) -> Void)?
    private let effectView: UIVisualEffectView
    private let lens = UIView()
    private let stack = UIStackView()
    private var ids: [String] = []
    private var buttons: [UIButton] = []
    private var signature = ""
    private var selectedId = ""
    private let accent = UIColor(red: 0.949, green: 0.420, blue: 0.314, alpha: 1)
    /// On iOS 26+ a real system UITabBar is used: Apple draws the Liquid Glass capsule and the sliding lens itself.
    private var systemBar: UITabBar?

    override init(frame: CGRect) {
        effectView = UIVisualEffectView(effect: UIBlurEffect(style: .systemUltraThinMaterialDark))
        super.init(frame: frame)
        overrideUserInterfaceStyle = .dark
        backgroundColor = .clear
        if #available(iOS 26.0, *) {
            let tb = UITabBar()
            tb.delegate = self
            tb.tintColor = accent
            tb.unselectedItemTintColor = UIColor.white.withAlphaComponent(0.92)
            tb.overrideUserInterfaceStyle = .dark
            addSubview(tb)
            systemBar = tb
            return
        }
        layer.shadowColor = UIColor.black.cgColor
        layer.shadowOpacity = 0.28
        layer.shadowRadius = 18
        layer.shadowOffset = CGSize(width: 0, height: 8)
        addSubview(effectView)
        lens.backgroundColor = UIColor.white.withAlphaComponent(0.14)
        lens.layer.cornerCurve = .continuous
        lens.alpha = 0
        effectView.contentView.addSubview(lens)
        stack.axis = .horizontal
        stack.distribution = .fillEqually
        stack.alignment = .fill
        effectView.contentView.addSubview(stack)
    }

    required init?(coder: NSCoder) { fatalError("init(coder:) has not been implemented") }

    /// rect = where the web tab bar sits; container = the view controller's view.
    func update(items: [(String, String, String)], selected: String, frame rect: CGRect, in container: UIView) {
        let sig = items.map { "\($0.0)/\($0.1)/\($0.2)" }.joined(separator: "|")
        if let tb = systemBar {
            let W = container.bounds.width, H = container.bounds.height
            frame = CGRect(x: 0, y: 0, width: W, height: H)
            isUserInteractionEnabled = true
            if sig != signature {
                signature = sig
                ids = items.map { $0.0 }
                tb.items = items.enumerated().map { (i, it) in
                    UITabBarItem(title: it.1, image: UIImage(systemName: it.2), tag: i)
                }
            }
            let h = tb.sizeThatFits(CGSize(width: W, height: H)).height
            tb.frame = CGRect(x: 0, y: H - h, width: W, height: h)
            if let idx = ids.firstIndex(of: selected), let all = tb.items, idx < all.count {
                if tb.selectedItem !== all[idx] { tb.selectedItem = all[idx] }
            } else {
                tb.selectedItem = nil
            }
            selectedId = selected
            return
        }
        frame = rect
        let r = rect.height / 2
        effectView.frame = bounds
        effectView.layer.cornerRadius = r
        effectView.layer.cornerCurve = .continuous
        effectView.clipsToBounds = true
        layer.shadowPath = UIBezierPath(roundedRect: bounds, cornerRadius: r).cgPath
        if sig != signature { signature = sig; rebuild(items) }
        stack.frame = effectView.contentView.bounds.insetBy(dx: 5, dy: 0)
        stack.layoutIfNeeded()
        select(selected, animated: !selectedId.isEmpty && selectedId != selected)
    }

    /// Only the system tab bar itself takes touches; the rest of this full-screen host passes them to the web view.
    override func hitTest(_ point: CGPoint, with event: UIEvent?) -> UIView? {
        let v = super.hitTest(point, with: event)
        if systemBar != nil, v === self { return nil }
        return v
    }

    func tabBar(_ tabBar: UITabBar, didSelect item: UITabBarItem) {
        guard item.tag >= 0, item.tag < ids.count else { return }
        UISelectionFeedbackGenerator().selectionChanged()
        onTap?(ids[item.tag])
    }

    private func rebuild(_ items: [(String, String, String)]) {
        buttons.forEach { $0.removeFromSuperview() }
        buttons = []
        ids = items.map { $0.0 }
        for it in items {
            var cfg = UIButton.Configuration.plain()
            cfg.image = UIImage(systemName: it.2, withConfiguration: UIImage.SymbolConfiguration(pointSize: 18, weight: .medium))
            cfg.imagePlacement = .top
            cfg.imagePadding = 3
            cfg.title = it.1
            cfg.titleTextAttributesTransformer = UIConfigurationTextAttributesTransformer { inc in
                var out = inc
                out.font = UIFont.systemFont(ofSize: 10, weight: .semibold)
                return out
            }
            cfg.contentInsets = NSDirectionalEdgeInsets(top: 4, leading: 0, bottom: 2, trailing: 0)
            let b = UIButton(configuration: cfg)
            b.accessibilityLabel = it.1
            let id = it.0
            b.addAction(UIAction { [weak self] _ in
                UISelectionFeedbackGenerator().selectionChanged()
                self?.onTap?(id)
            }, for: .touchUpInside)
            stack.addArrangedSubview(b)
            buttons.append(b)
        }
        selectedId = ""
    }

    private func select(_ id: String, animated: Bool) {
        selectedId = id
        for (i, b) in buttons.enumerated() {
            b.tintColor = ids[i] == id ? accent : UIColor.white.withAlphaComponent(0.92)
        }
        guard let idx = ids.firstIndex(of: id), idx < buttons.count else {
            UIView.animate(withDuration: 0.2) { self.lens.alpha = 0 }
            return
        }
        let b = buttons[idx]
        let f = stack.convert(b.frame, to: effectView.contentView).insetBy(dx: 1, dy: 5)
        let apply = {
            self.lens.frame = f
            self.lens.layer.cornerRadius = f.height / 2
            self.lens.alpha = 1
        }
        if animated && lens.alpha > 0 {
            UIView.animate(withDuration: 0.45, delay: 0, usingSpringWithDamping: 0.72, initialSpringVelocity: 0.4, options: [.beginFromCurrentState, .allowUserInteraction], animations: apply)
        } else {
            apply()
        }
    }
}
