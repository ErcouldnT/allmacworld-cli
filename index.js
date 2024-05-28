#! /usr/bin/env node
import axios from "axios";
import * as cheerio from "cheerio";
import { Command } from "commander";
import chalk from "chalk";
import open from "open";

const program = new Command();

program
  .command("search <product>")
  .description("search and list the results")
  .action(getData);

program
  .command("open <product>")
  .description("go to first product found in allmacworld.co")
  .action(openFirst);

const URL = "https://allmacworld.co/"; // https://allmacworld.co/?s=logic+pro
const results = [];

async function getData(searchTerm) {
  try {
    const response = await axios.get(URL, {
      params: {
        s: searchTerm,
      },
    });

    scrapeData(response.data);
    showResults();
  } catch (error) {
    console.error(chalk.red.bold(error.message));
  }
}

async function openFirst(product) {
  await getData(product);
  await open(results[0].url);
}

function scrapeData(html) {
  const $ = cheerio.load(html);

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
}

function showResults() {
  if (!results.length) return console.log(chalk.red.bold("No results found."));

  console.log(chalk.yellow.bold("Top " + results.length + " product(s):"));
  results.forEach((product, i) => {
    console.log(chalk.greenBright(`${i + 1}. ${product.name}`));
    console.log(chalk.blueBright(`${product.url}`));
  });
}

program.parse();
