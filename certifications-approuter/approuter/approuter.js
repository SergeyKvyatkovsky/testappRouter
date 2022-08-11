const approuter = require('@sap/approuter');
const axios = require('axios');
const ar = approuter();

const errorPage = `
<!DOCTYPE html>
<html lang="en" xml:lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1"/>
  <link rel="icon" type="image/x-icon" href="https://www.sap.com/favicon.ico" sizes="32x32"/>
  <style>
    *, ::after, ::before {
      box-sizing: border-box;
    }
    html, body {
      height: 100%;
    }
    body {
      display: flex;
      flex-direction: column;
      margin: 0;
    }
    .usp-static-page-content {
      min-height: calc(100vh - 144px);
    }
    .entry-message {
      height: 146px;
      background: transparent linear-gradient(90deg, rgb(38, 38, 38) 0%, rgba(110, 110, 110, 1) 100%) 0 0 no-repeat padding-box;
      font-family: BentonSans-Regular, sans-serif;
      color: rgb(255, 255, 255);
      font-size: 28px;
      padding-top: 30px!important;
      width: 100%;
    }
    @media only screen and (max-width: 767.98px) {
      .entry-message {
        height: 73px;
        font-size: 16px;
        padding-top: 10px!important;
      }
    }
    .entry-message span {
      color: rgb(240, 171, 0);
    }
    .main-message {
      margin: 52px 0;
      font-family: BentonSans-Book, sans-serif;
      font-size: 20px;
    }
    @media only screen and (max-width: 1199.98px) {
      .main-message {
        margin: 32px 0;
      }
    }
    @media only screen and (max-width: 767.98px) {
      .main-message {
        margin: 20px 0;
        font-size: 16px;
      }
    }
    .main-message a {
      color: rgb(0, 125, 184);
      white-space: nowrap;
    }
    .contact-information {
      font-family: BentonSans-Medium, sans-serif;
      font-size: 28px;
      margin-top: 1.5em;
      font-weight: 600;
    }
    @media only screen and (max-width: 1199.98px) {
      .contact-information {
        font-size: 20px;
      }
    }
    @media only screen and (max-width: 767.98px) {
      .contact-information {
        font-size: 16px;
      }
    }
    .usp-main-content-wrapper {
      padding: 0 90px;
      flex-grow: 1;
    }
    @media only screen and (max-width: 1199.98px) {
      .usp-main-content-wrapper {
        padding: 0 51px;
      }
    }
    @media only screen and (max-width: 767.98px) {
      .usp-main-content-wrapper {
        padding: 0 28px;
      }
    }
  </style>
  <script src="https://learninghub.sap.com/loadjs/web-components.js"></script>
</head>
<body>
<newlxp-header></newlxp-header>
<div>
  <div class="usp-static-page-content">
    <div class="entry-message usp-main-content-wrapper">
      <p>Sorry, <span>this page is currently unavailable.</span></p>
    </div>
    <div class="main-message usp-main-content-wrapper ">
        <p>We are currently experiencing technical issues with getting your certification data. Please try again later.</p>
        <p>In diesem Bereich treten derzeit technische Probleme auf. Wir entschuldigen uns für die Unannehmlichkeiten. Bitte versuchen sie es später erneut.</p>
        <p>Esta área está experimentando actualmente problemas técnicos. Pedimos disculpas por las molestias. Inténtelo de nuevo más tarde.</p>
        <p>Atualmente, essa área está passando por problemas técnicos. Pedimos desculpas pelo inconveniente. Tente novamente mais tarde.</p>
        <p>В настоящее время в этой области возникли технические проблемы. Приносим извинения за доставленные неудобства. Повторите попытку позднее.</p>
        <p>此区域当前遇到技术问题。对于给您带来的不便，我们深表歉意。请稍后重试。</p>
    </div>
  </div>
</div>
<newlxp-footer></newlxp-footer>
</body>
</html>
`;

const oVCAP_SERVICES = JSON.parse(process.env.VCAP_SERVICES);
console.log('oVCAP_SERVICES: ', oVCAP_SERVICES);
const xsuaaService = oVCAP_SERVICES.xsuaa[0].credentials;

ar.beforeRequestHandler.use('/index.html', async function middleware(req, res, next) {
	// index.html to do a health check only at the very beginning
	try {
		//all values from the XSUAA environment variables
		const tokenServiceUrl = xsuaaService.url;
		const clientId = xsuaaService.clientid;
		const clientSecret = xsuaaService.clientsecret;

		var params = new URLSearchParams();
		params.append('grant_type', 'client_credentials');
		params.append('client_id', clientId);
		params.append('client_secret', clientSecret);

		const response = await axios({
			method: 'post',
			url: tokenServiceUrl + '/oauth/token',
			params: params,
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			}
		});

		const responseStatusCode = response.status;

		if (responseStatusCode === 200) {
			res.statusCode = 200;
			next();
		} else {
			res.send(errorPage); // since status code is invalid, redirect user to the error page
		}
	} catch (error) {
		res.end(errorPage); // failed to do request, redirect user to the error page
	}
});

ar.start();
