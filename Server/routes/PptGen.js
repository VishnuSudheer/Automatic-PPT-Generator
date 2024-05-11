import { TextServiceClient } from "@google-ai/generativelanguage";
import fetch from "node-fetch";
import { GoogleAuth } from "google-auth-library";
import PptxGenJS from "pptxgenjs";
import "dotenv/config";
import ConvertAPI from "convertapi";
import { Router } from "express";
import fs from "fs";

const router = Router();

router.post("/post", (req, res) => {
  const convertapi = new ConvertAPI(process.env.CONVERT_API, {
    conversionTimeout: 60,
    uploadTimeout: 60,
    downloadTimeout: 200,
  });

  const MODEL_NAME = "models/text-bison-001";
  const API_KEY = process.env.API_KEY;
  const client = new TextServiceClient({
    authClient: new GoogleAuth().fromAPIKey(API_KEY),
  });

  var topic = req.body.topic;
  
  const sourcePath = "./Presentation.pptx";
  const destinationPath = "D:/main-project-v2/Client/public/Presentation.pptx";

  fs.unlink(destinationPath, function (err) {
    if (err) return console.log(err);
    console.log("file deleted successfully");
  });

  fs.unlink(sourcePath, function (err) {
    if (err) return console.log(err);
    console.log("file deleted successfully");
  });

  if (topic == "") {
    topic = "Null";
  }

  const url = "https://api.getimg.ai/v1/stable-diffusion-xl/text-to-image";
  const options = {
    method: "POST",
    headers: {
      accept: "application/json",
      "content-type": "application/json",
      authorization: 
      process.env.AUTH
    },
    body: JSON.stringify({ output_format: "png", prompt: topic }),
  };

    
  // Create a new presentation

  var pptx = new PptxGenJS();
  pptx.layout = "LAYOUT_WIDE";

  pptx.defineSlideMaster({
    title: "PLACEHOLDER_SLIDE",
    margin: [1, 1, 1, 1],
    background: { color: "b2b7ff" },
    objects: [
      { rect: { x: 0, y: 0, w: "100%", h: 0.75, fill: { color: "d5e8ff" } } },
      { topic: { name: "heading", options: { x: 0, y: 0, w: 10, h: 0.5 } } },
      {
        placeholder: {
          options: {
            name: "start",
            type: "body",
            x: 2.5,
            y: 2.5,
            w: "50%",
            h: 5.25,
            fontSize: 23,
            align: "center",
          },
        },
      },
      {
        placeholder: {
          options: {
            name: "body",
            type: "body",
            x: 1.6,
            y: 1.5,
            w: "50%",
            h: 5.25,
            fontSize: 23,
          },
        },
      },
    ],
    slideNumber: { x: 0.3, y: "95%" },
  });

  let Editedprompt =
    topic +
    "each heading should have a unique title and description(50 words atleast) about it, also output should be in a array where each element is heading and its description '| Heading | Description |'";
  let slide = [];
  let parsedData = [];
  let ans;

  client
    .generateText({
      model: MODEL_NAME,
      prompt: {
        examples: [
          {
            input:{ content: "indian actor allu arjun"},
            output:{
              content:
              ```| Heading | Description |
              |---|---|
              | Allu Arjun's Early Life | Allu Arjun was born on 8 April 1983 in Chennai, Tamil Nadu, India. He is the son of actor Allu Aravind and Nirmala Devi. He has two sisters, Allu Sneha and Allu Sirish. |
              | Allu Arjun's Acting Career | Allu Arjun made his acting debut in the 2003 Telugu film Gangotri. He has since starred in a number of successful Telugu films, including Arya (2004), Parugu (2005), Desamuduru (2007), Arya 2 (2009), Varudu (2010), Badrinath (2013), and Sarrainodu (2016). |
              | Allu Arjun's Personal Life | Allu Arjun married Sneha Reddy in 2011. They have two children, Allu Ayaan and Allu Arha. |
              | Allu Arjun's Awards and Accomplishments | Allu Arjun has won numerous awards for his acting, including two Filmfare Awards South, three Nandi Awards, and four CineMAA Awards. He was also awarded the Padma Shri by the Government of India in 2017. |
              | Allu Arjun's Impact on Telugu Cinema | Allu Arjun is one of the most popular and successful actors in Telugu cinema. He is known for his stylish and energetic performances, and he has helped to popularize the action genre in Telugu cinema. |
              | Allu Arjun's Future Projects | Allu Arjun is currently working on a number of upcoming projects, including Pushpa: The Rise (2021), Ala Vaikunthapurramuloo (2022), and Icon (2023). |
              ```,
            },
            input: { content: "holy christ" },
            output: {
              content:
              ```
              | Heading | Description |
              |---|---|
              | The Nativity | The Nativity is the Christian celebration of the birth of Jesus Christ. It is traditionally observed on December 25th. |
              | The Passion of Christ | The Passion of Christ is the Christian story of Jesus' suffering and death. It is traditionally observed on Good Friday. |
              | The Resurrection of Christ | The Resurrection of Christ is the Christian belief that Jesus rose from the dead three days after his 
              crucifixion. It is traditionally observed on Easter Sunday. |
              | The Ascension of Christ | The Ascension of Christ is the Christian belief that Jesus ascended into heaven 40 days after his resurrection. It is traditionally observed on Ascension Day. |
              | The Pentecost | The Pentecost is the Christian celebration of the coming of the Holy Spirit upon the Apostles. It is traditionally 
              observed on the seventh Sunday after Easter. |
              | The Assumption of Mary | The Assumption of Mary is the Christian belief that Mary was taken up into heaven bodily. It is traditionally observed on August 15th. |
              | The Immaculate Conception | The Immaculate Conception is the Christian belief that Mary was conceived without original sin. It is traditionally observed on December 8th. |
              | The Rosary | The Rosary is a Catholic prayer that consists of a series of prayers, meditations, and repetitions of the Hail Mary. It is traditionally prayed on a string of beads. |
              | The Stations of the Cross | The Stations of the Cross are a series of fourteen devotions that commemorate Jesus' journey to Calvary. They are traditionally prayed on Good Friday. |
              | The Divine Mercy | The Divine Mercy is a Catholic devotion that focuses on the mercy of God. It is traditionally celebrated on Divine Mercy Sunday, which is the Sunday after Easter. |
              ```,
            },
          },
        ],
        text: Editedprompt,
      },
    })
    .then((result) => {
      ans = result[0]["candidates"][0]["output"];
      CreatePPT(ans);
    });

  function CreatePPT(ans) {
    console.log(ans);
    let array = ans.split("\n");
    console.log(array);
    array.forEach((item, index) => {
      if (
        array[index] !== "```" &&
        array[index] !== "| Heading | Description |" &&
        array[index] !== "|---|---|"
      ) {
        const parts = item.split("|").map((part) => part.trim());
        const filteredParts = parts.filter((part) => part !== "");
        parsedData.push(filteredParts);
      }
    });

    fetch(url, options)
      .then((res) => res.json())
      .then((json) => {
        const base64Image = json.image; 
        slide[0].addImage({
          data: "image/png;base64," + base64Image,
          w: 2.5,
          h: 2.5,
          x: 10,
          y: 2,
        });
        pptx
          .writeFile()
          .then(() => console.log("Presentation Created"))
          .then(() => {
            fs.rename(sourcePath, destinationPath, (err) => {
              if (err) {
                console.error(err);
                // Handle the error appropriately (e.g., send an error message to the user)
              } else {
                console.log("Presentation moved successfully!");
                // Handle success (e.g., send a success message to the user)
              }
            });
          })
          .then(() => {
            convertapi
              .convert("png", {
                File: "D:/main-project-v2/Client/public/Presentation.pptx",
              })
              .then(function (result) {
                //get converted file url
                console.log("Converted file url: " + result.file.url);

                //save to file
                result
                  .saveFiles("D:/main-project-v2/Client/public/png")
                  .then(function (files) {
                    console.log("Files saved: " + files);
                    fs.writeFile(
                      "D:/main-project-v2/Client/public/DATA.txt",
                      JSON.stringify(files),
                      function (err) {
                        if (err) throw err;
                        console.log("File is created successfully.");
                      }
                    );
                    res.sendStatus(200)
                  })
              })

              .catch(function (e) {
                console.error(e.toString());
              });
          });
      })
      .catch((err) => console.error("error:" + err));
    CreateSlide();
  }

  function CreateSlide() {
    let i = 0;
    slide[0] = pptx.addSlide({ masterName: "PLACEHOLDER_SLIDE" });
    slide[0].addText(topic.toUpperCase(), { placeholder: "heading" });
    slide[0].addText(topic.toUpperCase(), { placeholder: "body" });
    console.log(parsedData);

    for (i = 0; i < parsedData.length; i++) {

      slide[i + 1] = pptx.addSlide({ masterName: "PLACEHOLDER_SLIDE" });
      if (parsedData[i] && parsedData[i][0]) {
        let string = parsedData[i][0].replace(/\*\*/g, "");
        slide[i + 1].addText(string, { placeholder: "heading" });
        slide[i + 1].addText(parsedData[i][1], { placeholder: "body" });
      } else {
        console.warn("Skipping slide due to missing data at index", i);
      }
    }
    slide.push(pptx.addSlide({ masterName: "PLACEHOLDER_SLIDE" }));
    slide[slide.length - 1].addText("Thank You", { placeholder: "body" });
    pptx.writeFile();
  }
});
export default router;
