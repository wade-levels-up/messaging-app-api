import { brandFontFamily, brandPrimaryColor, brandSecondaryColor, brandPrimaryFontColor, brandSecondaryFontColor } from "../branding/brand";

const buttonStyle: string = `
    display: inline-block;
    padding: 12px 24px;
    background-color: ${brandPrimaryColor};
    text-decoration: none;
    border-radius: 4px;
    font-size: 16px;
    margin-top: 16px;
   `

export default function verificationEmail(title: string, verificationLink: string): string {
    return `
        <div style="color: ${brandSecondaryFontColor}; text-align: center">
            <h1 style="color: ${brandPrimaryFontColor}; background-color: ${brandPrimaryColor}; font-family: ${brandFontFamily};">${title}</h1> 
            <img src="cid:businesslogo" alt="Business Logo" width="150px"/>
            <p style="background-color: ${brandSecondaryColor}">Click the button below to verify your account:</p>
            <a href="${verificationLink}" style="${buttonStyle}">Verify My Account</a>
        </div>
    `;
}