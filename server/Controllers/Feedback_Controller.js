const Feedback = require('../Models/Feedback_Model');
const Notification = require('../Models/Notification_Model');
const User = require('../Models/User_Model');
const { sendEmail } = require('../Utils/Email');

const submitFeedback = async (req, res, next) => {
  try {
    const feedback = await Feedback.create({ ...req.body, UserId: req.user._id, Name: req.user.Profile.Name, Email: req.user.Email });
    const admins = await User.find({ Role: 'Admin' }).select('_id');
    const adminNotifications = admins.map(admin =>
      Notification.create({ UserId: admin._id, Type: 'Feedback', Title: 'New Feedback', Message: `${req.user.Profile.Name} submitted feedback.`, Link: '/admin/feedbacks' })
    );
    await Promise.all(adminNotifications);
    res.status(201).json({ success: true, data: feedback });
  } catch (error) { next(error); }
};

const getAllFeedbacks = async (req, res, next) => {
  try {
    const data = await Feedback.find().populate('UserId', 'Username Profile.Name').sort({ createdAt: -1 }).lean();
    res.status(200).json({ success: true, count: data.length, data });
  } catch (error) { next(error); }
};

const markAsRead = async (req, res, next) => {
  try {
    const feedback = await Feedback.findByIdAndUpdate(req.params.id, { IsRead: true }, { new: true });
    if (!feedback) return res.status(404).json({ success: false, message: 'Feedback not found' });
    await Notification.create({ UserId: feedback.UserId, Type: 'Feedback', Title: 'Feedback Processed', Message: 'Your feedback has been reviewed by admin.', Link: '/profile' });
    res.status(200).json({ success: true, data: feedback });
  } catch (error) { next(error); }
};

const replyToFeedback = async (req, res, next) => {
  try {
    const { message } = req.body;
    if (!message || message.trim().length === 0) {
      return res.status(400).json({ success: false, message: 'Reply message is required' });
    }
    const feedback = await Feedback.findById(req.params.id);
    if (!feedback) return res.status(404).json({ success: false, message: 'Feedback not found' });
    feedback.Replies.push({ Message: message, AdminId: req.user._id });
    feedback.IsRead = true;
    await feedback.save();

    // Send email to user (from FitTrack Pro, no admin details)
    const emailSent = await sendEmail({
      to: feedback.Email,
      subject: 'FitTrack Pro - Response to Your Feedback',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #1a1a2e; color: #e0e0e0; border-radius: 12px; overflow: hidden;">
          <div style="background: linear-gradient(135deg, #7c3aed, #6d28d9); padding: 24px; text-align: center;">
            <h1 style="color: #fff; margin: 0; font-size: 22px;">FitTrack Pro</h1>
            <p style="color: rgba(255,255,255,0.8); margin: 4px 0 0; font-size: 13px;">Response to Your Feedback</p>
          </div>
          <div style="padding: 24px;">
            <p style="color: #e0e0e0;">Hi <strong>${feedback.Name}</strong>,</p>
            <p style="color: #a0a0a0; font-size: 13px; margin: 8px 0 16px;">Thank you for your feedback. Here is our response:</p>
            <div style="background: #16213e; border-left: 3px solid #7c3aed; padding: 16px; border-radius: 8px; margin: 16px 0;">
              <p style="color: #e0e0e0; margin: 0;">${message}</p>
            </div>
            <div style="background: #16213e; padding: 12px 16px; border-radius: 8px; margin: 16px 0;">
              <p style="color: #a0a0a0; font-size: 12px; margin: 0;"><strong style="color: #e0e0e0;">Your original message:</strong></p>
              <p style="color: #a0a0a0; font-size: 13px; margin: 4px 0 0;">${feedback.Message}</p>
            </div>
            <p style="color: #a0a0a0; font-size: 13px;">If you have any further questions, feel free to reach out via our <a href="${process.env.CLIENT_URL}/contact" style="color: #7c3aed;">Contact page</a>.</p>
            <p style="color: #a0a0a0; font-size: 13px; margin-top: 20px;">Best regards,<br/><strong style="color: #e0e0e0;">The FitTrack Pro Team</strong></p>
          </div>
          <div style="background: #16213e; padding: 16px; text-align: center;">
            <p style="color: #666; font-size: 11px; margin: 0;">This email was sent from FitTrack Pro. Please do not reply directly to this email.</p>
          </div>
        </div>
      `,
    });

    // Notify user about the reply
    await Notification.create({
      UserId: feedback.UserId,
      Type: 'Feedback',
      Title: 'Feedback Reply',
      Message: 'Admin has replied to your feedback.',
      Link: '/profile',
    });

    res.status(200).json({ success: true, data: feedback, emailSent });
  } catch (error) { next(error); }
};

module.exports = { submitFeedback, getAllFeedbacks, markAsRead, replyToFeedback };
