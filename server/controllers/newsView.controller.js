import { recordArticleViewService } from "../services/view.service.js";
import { generateVisitorHash, detectDevice } from "../utils/visitor.js";

export const incrementView = async (req, res) => {
  try {
    const { id: articleId } = req.params;

    const ip =
      req.headers["x-forwarded-for"]?.split(",")[0].trim() ||
      req.socket.remoteAddress ||
      req.ip;
    const userAgent = req.headers["user-agent"] || "unknown";
    const language = req.headers["accept-language"] || "";

    const visitorHash = generateVisitorHash(ip, userAgent, language);
    const device = detectDevice(userAgent);
    const userId = req.user?._id || null;

    const result = await recordArticleViewService({
      articleId,
      visitorHash,
      device,
      userId,
    });

    return res.status(200).json({
      success: true,
      incremented: result.incremented,
      views: result.views,
    });
  } catch (error) {
    console.error("Error in incrementView controller:", error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};