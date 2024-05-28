import axios from "axios";
import * as cheerio from "cheerio";

const URL = "https://allmacworld.co/"; // https://allmacworld.co/?s=logic+pro
const SEARCH_TERM = "logic pro";

const results = [];

async function getData() {
  try {
    const response = await axios.get(URL, {
      params: {
        s: SEARCH_TERM,
      },
    });

    const $ = cheerio.load(response.data);

    $("div.post-listing article").each((i, e) => {
      const productDiv = $(e).find("h2 a");

      const productName = productDiv.text().trim();
      const productPage = productDiv.attr("href").trim();

      const product = {
        name: productName,
        link: productPage,
      };

      results.push(product);
    });

    console.log(results);
  } catch (error) {
    console.error(error.message);
  }
}

getData();
