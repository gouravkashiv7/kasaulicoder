import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: Number(process.env.SMTP_PORT) || 587,
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export interface StaffWelcomeEmailOptions {
  toEmail: string;
  toName: string;
  role: string;
  designation?: string;
  roleDescription?: string;
  plainPassword: string;
}

const getRoleLabel = (role: string) => {
  switch (role) {
    case "superadmin":
      return "Super Administrator";
    case "admin":
      return "Administrator";
    case "editor":
      return "Content Editor";
    case "support":
      return "Support Specialist";
    default:
      return role.charAt(0).toUpperCase() + role.slice(1);
  }
};

const getRoleColor = (role: string) => {
  switch (role) {
    case "superadmin":
      return "#7c3aed";
    case "admin":
      return "#d97706";
    case "editor":
      return "#0891b2";
    case "support":
      return "#16a34a";
    default:
      return "#6b7280";
  }
};

export const sendStaffWelcomeEmail = async (
  opts: StaffWelcomeEmailOptions,
): Promise<void> => {
  const { toEmail, toName, role, designation, roleDescription, plainPassword } =
    opts;

  const roleLabel = getRoleLabel(role);
  const roleColor = getRoleColor(role);
  const year = new Date().getFullYear();

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Welcome to Kasaulicoder – You're on the team!</title>
</head>
<body style="margin:0;padding:0;background-color:#f4f6f9;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f6f9;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="620" cellpadding="0" cellspacing="0" style="max-width:620px;width:100%;background-color:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

          <!-- Header / Logo Banner -->
          <tr>
            <td style="background:linear-gradient(135deg,#1a1a2e 0%,#16213e 60%,#0f3460 100%);padding:40px 48px 36px;text-align:center;">
              <img src="https://kasaulicoder.com/mail.png" alt="Kasaulicoder Logo" width="160" style="display:block;margin:0 auto 20px;max-width:160px;" />
              <h1 style="margin:0;color:#ffffff;font-size:26px;font-weight:800;letter-spacing:-0.5px;line-height:1.3;">
                Welcome to the Team! 🎉
              </h1>
              <p style="margin:10px 0 0;color:rgba(255,255,255,0.65);font-size:14px;">
                Your Kasaulicoder staff account is ready
              </p>
            </td>
          </tr>

          <!-- Greeting -->
          <tr>
            <td style="padding:40px 48px 0;">
              <p style="margin:0;font-size:16px;color:#374151;line-height:1.7;">
                Hey <strong>${toName}</strong> 👋,
              </p>
              <p style="margin:14px 0 0;font-size:15px;color:#6b7280;line-height:1.8;">
                We're thrilled to have you join the <strong style="color:#1a1a2e;">Kasaulicoder</strong> family. Your account has been created and you're all set to start. Below you'll find everything you need to log in and get started.
              </p>
            </td>
          </tr>

          <!-- Role Badge -->
          <tr>
            <td style="padding:28px 48px 0;">
              <div style="display:inline-block;">
                <span style="display:inline-block;background-color:${roleColor}1a;color:${roleColor};border:1.5px solid ${roleColor}50;border-radius:99px;padding:6px 18px;font-size:12px;font-weight:700;letter-spacing:0.8px;text-transform:uppercase;">
                  ${roleLabel}
                </span>
              </div>
              ${
                designation
                  ? `<p style="margin:10px 0 0;font-size:14px;color:#374151;font-weight:600;">${designation}</p>`
                  : ""
              }
              ${
                roleDescription
                  ? `<p style="margin:6px 0 0;font-size:14px;color:#6b7280;line-height:1.7;">${roleDescription}</p>`
                  : ""
              }
            </td>
          </tr>

          <!-- Credentials Card -->
          <tr>
            <td style="padding:28px 48px 0;">
              <div style="background:#f8fafc;border:1.5px solid #e2e8f0;border-radius:12px;padding:28px 32px;">
                <p style="margin:0 0 18px;font-size:13px;font-weight:700;color:#64748b;letter-spacing:0.6px;text-transform:uppercase;">
                  🔐 Your Login Credentials
                </p>
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="padding-bottom:14px;">
                      <p style="margin:0;font-size:12px;font-weight:600;color:#94a3b8;text-transform:uppercase;letter-spacing:0.5px;">Email Address</p>
                      <p style="margin:4px 0 0;font-size:16px;color:#1e293b;font-weight:700;word-break:break-all;">${toEmail}</p>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <p style="margin:0;font-size:12px;font-weight:600;color:#94a3b8;text-transform:uppercase;letter-spacing:0.5px;">Temporary Password</p>
                      <div style="margin-top:6px;display:inline-block;background:#1e293b;border-radius:8px;padding:10px 20px;">
                        <code style="font-size:18px;font-weight:800;color:#f8fafc;letter-spacing:2px;font-family:'Courier New',monospace;">${plainPassword}</code>
                      </div>
                    </td>
                  </tr>
                </table>
              </div>
            </td>
          </tr>

          <!-- Warning: Change Password -->
          <tr>
            <td style="padding:20px 48px 0;">
              <div style="background:#fff7ed;border:1.5px solid #fdba74;border-radius:10px;padding:16px 20px;display:flex;gap:12px;">
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td width="28" valign="top" style="padding-right:12px;">
                      <span style="font-size:20px;">⚠️</span>
                    </td>
                    <td>
                      <p style="margin:0;font-size:13px;font-weight:700;color:#c2410c;">
                        Change your password immediately after first login
                      </p>
                      <p style="margin:4px 0 0;font-size:13px;color:#7c2d12;line-height:1.6;">
                        This is a <strong>temporary password</strong>. For your security, please update it to something strong and unique as soon as you log in from the staff portal.
                      </p>
                    </td>
                  </tr>
                </table>
              </div>
            </td>
          </tr>

          <!-- CTA Button -->
          <tr>
            <td style="padding:32px 48px 0;text-align:center;">
              <a href="https://kasaulicoder.com/login" style="display:inline-block;background:linear-gradient(135deg,#1a1a2e,#0f3460);color:#ffffff;text-decoration:none;font-size:15px;font-weight:700;padding:14px 36px;border-radius:10px;letter-spacing:0.3px;">
                Login to Your Account →
              </a>
            </td>
          </tr>

          <!-- Coming Soon / Features Section -->
          <tr>
            <td style="padding:36px 48px 0;">
              <div style="border-top:1.5px solid #e2e8f0;padding-top:32px;">
                <p style="margin:0 0 20px;font-size:13px;font-weight:700;color:#64748b;letter-spacing:0.6px;text-transform:uppercase;">
                  🚀 Exciting Features Coming Soon
                </p>
                <table width="100%" cellpadding="0" cellspacing="0" style="border-spacing:0 10px;">
                  <tr>
                    <td style="padding-bottom:12px;">
                      <div style="display:flex;align-items:flex-start;gap:12px;">
                        <table width="100%" cellpadding="0" cellspacing="0">
                          <tr>
                            <td width="32" valign="top">
                              <div style="width:28px;height:28px;background:#ede9fe;border-radius:8px;text-align:center;line-height:28px;font-size:14px;">🎓</div>
                            </td>
                            <td style="padding-left:12px;">
                              <p style="margin:0;font-size:14px;font-weight:700;color:#1e293b;">Live Cohort Batches</p>
                              <p style="margin:2px 0 0;font-size:13px;color:#6b7280;line-height:1.6;">Structured cohort-based learning with live sessions, projects, and mentorship.</p>
                            </td>
                          </tr>
                        </table>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding-bottom:12px;">
                      <table width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                          <td width="32" valign="top">
                            <div style="width:28px;height:28px;background:#ecfdf5;border-radius:8px;text-align:center;line-height:28px;font-size:14px;">🤖</div>
                          </td>
                          <td style="padding-left:12px;">
                            <p style="margin:0;font-size:14px;font-weight:700;color:#1e293b;">AI-Powered Code Review</p>
                            <p style="margin:2px 0 0;font-size:13px;color:#6b7280;line-height:1.6;">Intelligent feedback on student submissions directly inside the platform.</p>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding-bottom:12px;">
                      <table width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                          <td width="32" valign="top">
                            <div style="width:28px;height:28px;background:#eff6ff;border-radius:8px;text-align:center;line-height:28px;font-size:14px;">📊</div>
                          </td>
                          <td style="padding-left:12px;">
                            <p style="margin:0;font-size:14px;font-weight:700;color:#1e293b;">Advanced Staff Analytics</p>
                            <p style="margin:2px 0 0;font-size:13px;color:#6b7280;line-height:1.6;">Track student progress, engagement metrics, and platform insights in real-time.</p>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <table width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                          <td width="32" valign="top">
                            <div style="width:28px;height:28px;background:#fff7ed;border-radius:8px;text-align:center;line-height:28px;font-size:14px;">🏆</div>
                          </td>
                          <td style="padding-left:12px;">
                            <p style="margin:0;font-size:14px;font-weight:700;color:#1e293b;">Certificates & Badges</p>
                            <p style="margin:2px 0 0;font-size:13px;color:#6b7280;line-height:1.6;">Auto-generated certificates for students upon course completion and milestones.</p>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </div>
            </td>
          </tr>

          <!-- Sign off -->
          <tr>
            <td style="padding:32px 48px 0;">
              <p style="margin:0;font-size:15px;color:#374151;line-height:1.8;">
                If you have any questions or need assistance getting started, just reply to this email — we're here for you.
              </p>
              <p style="margin:18px 0 0;font-size:15px;color:#374151;">
                Cheers,<br/>
                <strong style="color:#1a1a2e;">Kasaulicoder Leadership</strong>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:36px 48px 40px;">
              <div style="border-top:1px solid #e2e8f0;padding-top:24px;text-align:center;">
                <img src="https://kasaulicoder.com/mail.png" alt="Kasaulicoder Logo" width="110" style="display:block;margin:0 auto 12px;max-width:110px;" />
                <p style="margin:0;font-size:12px;color:#9ca3af;line-height:1.7;">
                  © Kasauli coder 2026 | All Rights Reserved
                </p>
              </div>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  await transporter.sendMail({
    from: `"Kasaulicoder" <${process.env.SMTP_FROM || "info@kasaulicoder.com"}>`,
    to: toEmail,
    subject: `🎉 Welcome to Kasaulicoder, ${toName}! Your account is ready`,
    html,
  });
};

export const sendAccountDeactivationEmail = async (
  email: string,
  name: string,
): Promise<void> => {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Account Deactivated - Kasaulicoder</title>
</head>
<body style="margin:0;padding:0;background-color:#f4f6f9;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f6f9;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="620" cellpadding="0" cellspacing="0" style="max-width:620px;width:100%;background-color:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
          <tr>
            <td style="background:#ef4444;padding:30px 48px;text-align:center;">
              <h1 style="margin:0;color:#ffffff;font-size:24px;font-weight:800;letter-spacing:-0.5px;">Account Deactivated</h1>
            </td>
          </tr>
          <tr>
            <td style="padding:40px 48px 32px;">
              <p style="margin:0 0 16px;font-size:16px;color:#374151;line-height:1.7;">
                Hello <strong>${name}</strong>,
              </p>
              <p style="margin:0 0 24px;font-size:16px;color:#4b5563;line-height:1.7;">
                This email is to inform you that your Kasaulicoder account has been deactivated by an administrator. You will no longer be able to access the platform.
              </p>
              <div style="background:#fef2f2;border:1px solid #fecaca;border-radius:8px;padding:16px;margin-bottom:24px;">
                <p style="margin:0;font-size:14px;color:#991b1b;line-height:1.6;">
                  If you believe this is an error or wish to request account restoration, please contact our administrative team.
                </p>
              </div>
              <p style="margin:0;font-size:15px;color:#374151;">
                Regards,<br/>
                <strong>Kasaulicoder Operations</strong>
              </p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding:0 48px 40px;">
              <div style="border-top:1px solid #e2e8f0;padding-top:24px;text-align:center;">
                <img src="https://kasaulicoder.com/mail.png" alt="Kasaulicoder Logo" width="110" style="display:block;margin:0 auto 12px;max-width:110px;" />
                <p style="margin:0;font-size:12px;color:#9ca3af;line-height:1.7;">
                  © Kasauli coder 2026 | All Rights Reserved
                </p>
              </div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  await transporter.sendMail({
    from: `"Kasaulicoder Admin" <${process.env.SMTP_FROM || "info@kasaulicoder.com"}>`,
    to: email,
    subject: `Notice: Your Kasaulicoder account has been deactivated`,
    html,
  });
};

export const sendAccountActivationEmail = async (
  email: string,
  name: string,
): Promise<void> => {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Account Reactivated - Kasaulicoder</title>
</head>
<body style="margin:0;padding:0;background-color:#f4f6f9;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f6f9;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="620" cellpadding="0" cellspacing="0" style="max-width:620px;width:100%;background-color:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
          <tr>
            <td style="background:#10b981;padding:30px 48px;text-align:center;">
              <h1 style="margin:0;color:#ffffff;font-size:24px;font-weight:800;letter-spacing:-0.5px;">Account Reactivated</h1>
            </td>
          </tr>
          <tr>
            <td style="padding:40px 48px 32px;">
              <p style="margin:0 0 16px;font-size:16px;color:#374151;line-height:1.7;">
                Welcome back, <strong>${name}</strong> 🎉
              </p>
              <p style="margin:0 0 24px;font-size:16px;color:#4b5563;line-height:1.7;">
                Good news! Your Kasaulicoder account has been reactivated by an administrator. You now have full access to the platform again.
              </p>
              <div style="text-align:center;margin:32px 0;">
                <a href="https://kasaulicoder.com/login" style="display:inline-block;background:#1a1a2e;color:#ffffff;text-decoration:none;font-size:15px;font-weight:700;padding:14px 32px;border-radius:8px;">
                  Login Now
                </a>
              </div>
              <p style="margin:0;font-size:15px;color:#374151;">
                Regards,<br/>
                <strong>Kasaulicoder Operations</strong>
              </p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding:0 48px 40px;">
              <div style="border-top:1px solid #e2e8f0;padding-top:24px;text-align:center;">
                <img src="https://kasaulicoder.com/mail.png" alt="Kasaulicoder Logo" width="110" style="display:block;margin:0 auto 12px;max-width:110px;" />
                <p style="margin:0;font-size:12px;color:#9ca3af;line-height:1.7;">
                  © Kasauli coder 2026 | All Rights Reserved
                </p>
              </div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  await transporter.sendMail({
    from: `"Kasaulicoder Admin" <${process.env.SMTP_FROM || "info@kasaulicoder.com"}>`,
    to: email,
    subject: `Good News: Your Kasaulicoder account is active again`,
    html,
  });
};
export interface SocialMediaAssignmentEmailOptions {
  toEmail: string;
  toName: string;
  platform: string;
  username: string;
  password?: string;
}

export const sendSocialMediaAssignmentEmail = async (
  opts: SocialMediaAssignmentEmailOptions,
): Promise<void> => {
  const { toEmail, toName, platform, username, password } = opts;
  const year = new Date().getFullYear();

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>New Social Media Responsibility – Kasaulicoder</title>
</head>
<body style="margin:0;padding:0;background-color:#f4f6f9;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f6f9;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="620" cellpadding="0" cellspacing="0" style="max-width:620px;width:100%;background-color:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#0f172a 0%,#1e293b 100%);padding:40px 48px;text-align:center;">
              <h1 style="margin:0;color:#ffffff;font-size:24px;font-weight:800;letter-spacing:-0.5px;">New Responsibility Assigned 📱</h1>
              <p style="margin:10px 0 0;color:rgba(255,255,255,0.6);font-size:14px;">Social Media Management</p>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding:40px 48px 0;">
              <p style="margin:0;font-size:16px;color:#374151;line-height:1.7;">
                Hello <strong>${toName}</strong>,
              </p>
              <p style="margin:14px 0 0;font-size:15px;color:#4b5563;line-height:1.8;">
                You have been assigned responsibility for a new social media account on <strong style="color:#0f172a;">${platform}</strong>. Please ensure all brand guidelines are followed while managing this channel.
              </p>
            </td>
          </tr>

          <!-- Account Details Card -->
          <tr>
            <td style="padding:32px 48px 0;">
              <div style="background:#f8fafc;border:1.5px solid #e2e8f0;border-radius:12px;padding:28px;">
                <p style="margin:0 0- 18px;font-size:13px;font-weight:700;color:#64748b;letter-spacing:0.6px;text-transform:uppercase;">
                  Credential Details
                </p>
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="padding-bottom:16px;">
                      <p style="margin:0;font-size:12px;font-weight:600;color:#94a3b8;text-transform:uppercase;">Platform</p>
                      <p style="margin:4px 0 0;font-size:16px;color:#1e293b;font-weight:700;">${platform}</p>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding-bottom:16px;">
                      <p style="margin:0;font-size:12px;font-weight:600;color:#94a3b8;text-transform:uppercase;">Username</p>
                      <p style="margin:4px 0 0;font-size:16px;color:#1e293b;font-weight:700;">${username}</p>
                    </td>
                  </tr>
                  ${password ? `
                  <tr>
                    <td>
                      <p style="margin:0;font-size:12px;font-weight:600;color:#94a3b8;text-transform:uppercase;">Password</p>
                      <div style="margin-top:6px;display:inline-block;background:#1e293b;border-radius:6px;padding:8px 16px;">
                        <code style="font-size:16px;color:#ffffff;font-family:monospace;">${password}</code>
                      </div>
                    </td>
                  </tr>
                  ` : ""}
                </table>
              </div>
            </td>
          </tr>

          <!-- Guidelines -->
          <tr>
            <td style="padding:32px 48px 0;">
              <p style="margin:0;font-size:14px;font-weight:700;color:#374151;">Guidelines for Management:</p>
              <ul style="margin:10px 0 0;padding-left:20px;font-size:14px;color:#6b7280;line-height:1.7;">
                <li>Maintain a professional and engaging brand voice.</li>
                <li>Ensure all content follows the Kasaulicoder brand style.</li>
                <li>Respond to queries and comments promptly.</li>
                <li>Report any security concerns immediately.</li>
              </ul>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:40px 48px;">
              <div style="border-top:1px solid #e2e8f0;padding-top:24px;text-align:center;">
                <p style="margin:0;font-size:12px;color:#9ca3af;">
                  © ${year} Kasaulicoder | Administrative Notification
                </p>
              </div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  await transporter.sendMail({
    from: `"Kasaulicoder Admin" <${process.env.SMTP_FROM || "info@kasaulicoder.com"}>`,
    to: toEmail,
    subject: `📋 Responsibility Assigned: ${platform} (${username})`,
    html,
  });
};
