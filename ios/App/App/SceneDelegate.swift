import UIKit
import Capacitor
import WebKit
import PhotosUI

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

/// Bridge view controller. Talks to the web app over a plain WKScriptMessageHandler ("glassBar"),
/// so it does not depend on Capacitor plugin registration.
class MainViewController: CAPBridgeViewController, WKScriptMessageHandler {
    private var glassBar: GlassBarView?
    private var pickId = ""
    private var topView: GlassTopView?

    override func capacitorDidLoad() {
        webView?.configuration.userContentController.add(self, name: "glassBar")
        webView?.configuration.userContentController.add(self, name: "igStory")
        webView?.configuration.userContentController.add(self, name: "pickPhoto")
    }

    // MARK: Instagram "Share to Stories" (sticker + optional background via the pasteboard)
    private func igDone(_ ok: Bool, _ why: String) {
        let safe = why.replacingOccurrences(of: "'", with: "")
        DispatchQueue.main.async {
            self.webView?.evaluateJavaScript("window.__igStoryDone&&window.__igStoryDone(\(ok),'\(safe)')", completionHandler: nil)
        }
    }

    private func shareToInstagram(_ body: [String: Any]) {
        let appID = ((Bundle.main.object(forInfoDictionaryKey: "FacebookAppID") as? String) ?? "").trimmingCharacters(in: .whitespaces)
        guard !appID.isEmpty, appID.allSatisfy({ $0.isNumber }) else { igDone(false, "noappid"); return }
        guard let url = URL(string: "instagram-stories://share?source_application=\(appID)"),
              UIApplication.shared.canOpenURL(url) else { igDone(false, "noinstagram"); return }
        var item: [String: Any] = ["com.instagram.sharedSticker.appID": appID]
        if let s = body["sticker"] as? String, let d = Data(base64Encoded: s) { item["com.instagram.sharedSticker.stickerImage"] = d }
        if let b = body["background"] as? String, let d = Data(base64Encoded: b) { item["com.instagram.sharedSticker.backgroundImage"] = d }
        if let t = body["top"] as? String { item["com.instagram.sharedSticker.backgroundTopColor"] = t }
        if let t = body["bottom"] as? String { item["com.instagram.sharedSticker.backgroundBottomColor"] = t }
        guard item.count > 1 else { igDone(false, "empty"); return }
        UIPasteboard.general.setItems([item], options: [.expirationDate: Date().addingTimeInterval(300)])
        UIApplication.shared.open(url, options: [:]) { ok in self.igDone(ok, ok ? "" : "openfailed") }
    }

    func userContentController(_ userContentController: WKUserContentController, didReceive message: WKScriptMessage) {
        if message.name == "pickPhoto" {
            let body = (message.body as? [String: Any]) ?? [:]
            presentPhotoPicker((body["id"] as? String) ?? "")
            return
        }
        if message.name == "igStory" {
            let body = (message.body as? [String: Any]) ?? [:]
            if (body["cmd"] as? String) == "check" {
                let appID = ((Bundle.main.object(forInfoDictionaryKey: "FacebookAppID") as? String) ?? "").trimmingCharacters(in: .whitespaces)
                let ok = !appID.isEmpty && appID.allSatisfy({ $0.isNumber })
                    && UIApplication.shared.canOpenURL(URL(string: "instagram-stories://share")!)
                webView?.evaluateJavaScript("window.__igReady&&window.__igReady(\(ok))", completionHandler: nil)
                return
            }
            shareToInstagram(body); return
        }
        guard message.name == "glassBar", let body = message.body as? [String: Any] else { return }
        let cmd = (body["cmd"] as? String) ?? ""
        if cmd == "hide" {
            glassBar?.isHidden = true
            return
        }
        if cmd == "topHide" {
            topView?.isHidden = true
            return
        }
        if cmd == "top" {
            handleTop(body)
            return
        }
        guard cmd == "show", let web = webView else { return }
        let rawItems = (body["items"] as? [[String: Any]]) ?? []
        let items: [(String, String, String)] = rawItems.map {
            (($0["id"] as? String) ?? "", ($0["label"] as? String) ?? "", ($0["icon"] as? String) ?? "circle")
        }
        let selected = (body["selected"] as? String) ?? ""
        let f = (body["frame"] as? [String: Any]) ?? [:]
        func n(_ k: String) -> CGFloat {
            if let v = f[k] as? NSNumber { return CGFloat(truncating: v) }
            return 0
        }
        let rect = CGRect(x: n("x"), y: n("y"), width: n("w"), height: n("h"))
        guard rect.width > 10, rect.height > 10, !items.isEmpty else { return }
        let span = web.convert(CGRect(x: n("bx"), y: 0, width: n("bw") > 10 ? n("bw") : rect.width, height: 1), to: view)
        if glassBar == nil {
            let b = GlassBarView(frame: .zero)
            b.onTap = { [weak self] id in
                let safe = id.replacingOccurrences(of: "'", with: "")
                self?.webView?.evaluateJavaScript("window.__glassTap&&window.__glassTap('\(safe)')", completionHandler: nil)
            }
            view.addSubview(b)
            glassBar = b
        }
        guard let bar = glassBar else { return }
        let target = web.convert(rect, to: view)
        let wasHidden = bar.isHidden
        bar.isHidden = false
        bar.update(items: items, selected: selected, frame: target, span: span, in: view)
        view.bringSubviewToFront(bar)
        if wasHidden {
            bar.alpha = 0
            UIView.animate(withDuration: 0.18) { bar.alpha = 1 }
        }
        if let t = topView { view.bringSubviewToFront(t) }
        web.evaluateJavaScript("window.__glassAck&&window.__glassAck()", completionHandler: nil)
    }

    private func handleTop(_ body: [String: Any]) {
        guard let web = webView else { return }
        let raw = (body["buttons"] as? [[String: Any]]) ?? []
        if topView == nil {
            let t = GlassTopView(frame: view.bounds)
            t.onTap = { [weak self] id in
                let safe = id.replacingOccurrences(of: "'", with: "")
                self?.webView?.evaluateJavaScript("window.__glassTopTap&&window.__glassTopTap('\(safe)')", completionHandler: nil)
            }
            view.addSubview(t)
            topView = t
        }
        guard let tv = topView else { return }
        tv.frame = view.bounds
        tv.isHidden = false
        let specs: [GlassTopView.Spec] = raw.compactMap { d in
            guard let id = d["id"] as? String, let r = d["frame"] as? [String: Any] else { return nil }
            func n(_ k: String) -> CGFloat {
                if let v = r[k] as? NSNumber { return CGFloat(truncating: v) }
                return 0
            }
            let rect = web.convert(CGRect(x: n("x"), y: n("y"), width: n("w"), height: n("h")), to: view)
            return GlassTopView.Spec(
                id: id, frame: rect,
                symbol: (d["icon"] as? String) ?? "",
                title: (d["title"] as? String) ?? "",
                prominent: (d["prominent"] as? Bool) ?? false,
                tint: colorFromHex((d["tint"] as? String) ?? ""),
                fg: colorFromHex((d["fg"] as? String) ?? ""),
                enabled: (d["enabled"] as? Bool) ?? true,
                busy: (d["busy"] as? Bool) ?? false)
        }
        tv.apply(specs)
        view.bringSubviewToFront(tv)
        web.evaluateJavaScript("window.__glassTopAck&&window.__glassTopAck()", completionHandler: nil)
    }
}

func colorFromHex(_ s: String) -> UIColor? {
    var h = s.trimmingCharacters(in: .whitespaces)
    if h.hasPrefix("#") { h.removeFirst() }
    guard h.count == 6, let v = UInt32(h, radix: 16) else { return nil }
    return UIColor(red: CGFloat((v >> 16) & 0xFF) / 255, green: CGFloat((v >> 8) & 0xFF) / 255, blue: CGFloat(v & 0xFF) / 255, alpha: 1)
}

/// Top bar buttons as system Liquid Glass buttons (iOS 26+), placed exactly over the web buttons.
final class GlassTopView: UIView {
    struct Spec {
        let id: String
        let frame: CGRect
        let symbol: String
        let title: String
        let prominent: Bool
        let tint: UIColor?
        let fg: UIColor?
        let enabled: Bool
        let busy: Bool
    }
    var onTap: ((String) -> Void)?
    private var buttons: [String: UIButton] = [:]

    override init(frame: CGRect) {
        super.init(frame: frame)
        backgroundColor = .clear
        overrideUserInterfaceStyle = .dark
    }

    required init?(coder: NSCoder) { fatalError("init(coder:) has not been implemented") }

    override func hitTest(_ point: CGPoint, with event: UIEvent?) -> UIView? {
        let v = super.hitTest(point, with: event)
        return v === self ? nil : v
    }

    private func baseConfig(_ prominent: Bool) -> UIButton.Configuration {
        #if compiler(>=6.2)
        if #available(iOS 26.0, *) {
            return prominent ? UIButton.Configuration.prominentGlass() : UIButton.Configuration.glass()
        }
        #endif
        return prominent ? UIButton.Configuration.filled() : UIButton.Configuration.gray()
    }

    func apply(_ specs: [Spec]) {
        let ids = Set(specs.map { $0.id })
        for (id, b) in buttons where !ids.contains(id) {
            b.removeFromSuperview()
            buttons[id] = nil
        }
        for s in specs {
            let b: UIButton
            if let existing = buttons[s.id] {
                b = existing
            } else {
                b = UIButton(type: .system)
                let id = s.id
                b.addAction(UIAction { [weak self] _ in
                    UIImpactFeedbackGenerator(style: .light).impactOccurred()
                    self?.onTap?(id)
                }, for: .touchUpInside)
                addSubview(b)
                buttons[s.id] = b
            }
            var cfg = baseConfig(s.prominent)
            if !s.symbol.isEmpty {
                cfg.image = UIImage(systemName: s.symbol, withConfiguration: UIImage.SymbolConfiguration(pointSize: 16, weight: .semibold))
            }
            cfg.title = s.title.isEmpty ? nil : s.title
            cfg.imagePadding = 6
            cfg.cornerStyle = .capsule
            cfg.showsActivityIndicator = s.busy
            cfg.contentInsets = NSDirectionalEdgeInsets(top: 0, leading: 4, bottom: 0, trailing: 4)
            cfg.titleTextAttributesTransformer = UIConfigurationTextAttributesTransformer { inc in
                var out = inc
                out.font = UIFont.systemFont(ofSize: 16, weight: .semibold)
                return out
            }
            if let fg = s.fg { cfg.baseForegroundColor = fg }
            if !s.prominent, s.fg == nil { cfg.baseForegroundColor = .white }
            b.configuration = cfg
            if let t = s.tint { b.tintColor = t }
            b.isEnabled = s.enabled
            b.alpha = s.enabled ? 1 : 0.45
            b.frame = s.frame
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
    func update(items: [(String, String, String)], selected: String, frame rect: CGRect, span: CGRect, in container: UIView) {
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
            let h = tb.sizeThatFits(CGSize(width: span.width, height: H)).height
            tb.frame = CGRect(x: span.minX, y: H - h, width: span.width, height: h)
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


// MARK: - Studio Typo: photo picker straight into the photo library (no "Photo Library / Take Photo / Choose File" menu)
extension MainViewController: PHPickerViewControllerDelegate {
    func presentPhotoPicker(_ id: String) {
        pickId = id.replacingOccurrences(of: "'", with: "")
        var config = PHPickerConfiguration()
        config.filter = .images
        config.selectionLimit = 1
        config.preferredAssetRepresentationMode = .current
        let picker = PHPickerViewController(configuration: config)
        picker.delegate = self
        present(picker, animated: true)
    }

    func picker(_ picker: PHPickerViewController, didFinishPicking results: [PHPickerResult]) {
        picker.dismiss(animated: true)
        let id = pickId
        guard let provider = results.first?.itemProvider, provider.canLoadObject(ofClass: UIImage.self) else {
            photoPicked(id, nil)
            return
        }
        provider.loadObject(ofClass: UIImage.self) { [weak self] object, _ in
            guard let self = self else { return }
            guard let image = object as? UIImage, image.size.width > 0, image.size.height > 0 else {
                self.photoPicked(id, nil)
                return
            }
            let maxSide: CGFloat = 2160
            let scale = min(1, maxSide / max(image.size.width, image.size.height))
            let size = CGSize(width: floor(image.size.width * scale), height: floor(image.size.height * scale))
            let format = UIGraphicsImageRendererFormat.default()
            format.scale = 1
            let resized = UIGraphicsImageRenderer(size: size, format: format).image { _ in
                image.draw(in: CGRect(origin: .zero, size: size))
            }
            self.photoPicked(id, resized.jpegData(compressionQuality: 0.9)?.base64EncodedString())
        }
    }

    private func photoPicked(_ id: String, _ base64: String?) {
        DispatchQueue.main.async {
            let arg = base64.map { "'data:image/jpeg;base64,\($0)'" } ?? "null"
            self.webView?.evaluateJavaScript("window.__photoPicked&&window.__photoPicked('\(id)',\(arg))", completionHandler: nil)
        }
    }
}
