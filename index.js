#! /usr/bin/env node
import axios from "axios";
import * as cheerio from "cheerio";
import { Command } from "commander";

const program = new Command();

program
  .command("search <product>")
  .description("try to find given product in allmacworld.co")
  .action(getData);

const URL = "https://allmacworld.co/"; // https://allmacworld.co/?s=logic+pro
const results = [];

async function getData(searchTerm) {
  try {
    const response = await axios.get(URL, {
      params: {
        s: searchTerm,
      },
    });

    const $ = cheerio.load(response.data);

    $("div.post-listing article").each((i, e) => {
      const productDiv = $(e).find("h2 a");

      const productName = productDiv.text().trim();
      const productPage = productDiv.attr("href").trim();

      const product = {
        name: productName,
        url: productPage,
      };

      results.push(product);
    });

    console.log(results);
  } catch (error) {
    console.error(error.message);
  }
}

program.parse();
