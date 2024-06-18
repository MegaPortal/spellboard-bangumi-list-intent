import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {

    const resp = await fetch("https://apiy.miluxing.com/api/anime-new/list", {
        "headers": {
          "accept": "application/json, text/plain, */*",
          "accept-language": "en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7",
          "cache-control": "no-cache",
          "language": "zh-CN",
          "pragma": "no-cache",
          "priority": "u=1, i",
          "sec-ch-ua": "\"Not/A)Brand\";v=\"8\", \"Chromium\";v=\"126\", \"Google Chrome\";v=\"126\"",
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": "\"macOS\"",
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-site",
          "Referer": "https://www.miluxing.com/",
          "Referrer-Policy": "strict-origin-when-cross-origin"
        },
        "body": null,
        "method": "GET"
      });

    const data = await resp.json();

    res.status(200).json(data);
}