export const template = (username: string, subject: string) => `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Welcome to CardioAI</title>

  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #f4f7fb;
      font-family: "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      color: #2c2c2c;
    }

    .wrapper {
      width: 100%;
      padding: 40px 0;
    } 

    .container {
      max-width: 620px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
      border: 1px solid #e6ebf2;
    }

    .header {
      background: linear-gradient(135deg, #0a3d62, #1e6fa8);
      padding: 30px;
      text-align: center;
      color: #ffffff;
    }

    .header h1 {
      margin: 0;
      font-size: 22px;
      font-weight: 600;
      letter-spacing: 0.5px;
    }

    .content {
      padding: 35px 40px;
      text-align: center;
    }

    .content h2 {
      margin-top: 0;
      font-size: 20px;
      font-weight: 600;
      color: #1f2d3d;
    }

    .content p {
      font-size: 15px;
      line-height: 1.7;
      color: #555;
      margin: 12px 0;
    }

    .note {
      font-size: 13px;
      color: #777;
      margin-top: 20px;
    }

    .footer {
      background-color: #f9fafc;
      border-top: 1px solid #e6ebf2;
      padding: 18px;
      text-align: center;
      font-size: 12px;
      color: #888;
    }

    .footer span {
      color: #0a3d62;
      font-weight: 600;
    }
  </style>
</head>

<body>
  <div class="wrapper">
    <div class="container">

      <div class="header">
        <h1>CardioAI Medical Platform</h1>
      </div>

      <div class="content">
        <h2>Hello ${username}</h2>

        <p>
          Welcome to CardioAI. Your account has been created successfully on our website.
        </p>

        <p>
          We are glad to have you with us and hope the platform helps you manage your health journey in a simple and reliable way.
        </p>

        <p class="note">
          If this account was not created by you, please contact support as soon as possible.
        </p>
      </div>

      <div class="footer">
        © 2026 <span>CardioAI</span> — Secure Medical AI Platform
      </div>

    </div>
  </div>
</body>
</html>`;
