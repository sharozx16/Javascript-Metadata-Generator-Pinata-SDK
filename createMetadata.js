const thc = require("./thc.json");
const fs = require("fs");
const pinataSDK = require("@pinata/sdk");
const path = require("path");
require("dotenv").config();




const location = "/home/user/png/"; //local path for image folder

const pinatakey =  process.env.API_KEY_PINATA //api key from env
const pinatasecret = process.env.API_SECRET_PINATA //pinata api secret from env

let pinata = pinataSDK(pinatakey,pinatasecret)

let tokenMetadata = [];

//template for metadata fields
const metadataTemplate = {
  description: "",
  external_url: "",
  image: "",
  name: "",
  attributes: [],
};

const description =
  "Write your NFT description here";


//writes a template for your metadata fields
async function writeJsonTemplate() {
  const nameString = [];
  for (let i = 0; i < thc.length; i++) {
    nameString.push(metadataTemplate);
  }
  fs.writeFileSync("./metadata.json", JSON.stringify(nameString, null, 2));
}

//  async function editAttrbutes() {

//     for  (let i = 0; i < thc.length; i++) {
//         tokenMetadata[i] = { ...metadataTemplate };
//     }
//     fs.writeFileSync("./metadata.json", JSON.stringify(tokenMetadata, null, 2));
// const readJson =  fs.readFile(toString(thc), "utf8", (err, jsonString) => {
//     if (err) {
//       console.log("File read failed:", err);
//       return;
//     }
//     console.log("File data:", jsonString);
//   });

//  }

//edits the fields created and adds custom data
async function editJson() {

  //stores the images on pinata and returns the hashes of the images
  const { responses: imageUploadResponses, files } = await storeImages(
    location
  );

  for (imageUploadResponseIndex in imageUploadResponses)  {

    const temp = files[imageUploadResponseIndex].replace("NFT PROJECT NAME_","")
    const temp2 = temp.replace(".png", "")

    tokenMetadata[imageUploadResponseIndex] = { ...metadataTemplate };
    tokenMetadata[imageUploadResponseIndex].name = files[imageUploadResponseIndex].replace(".png", "");
    tokenMetadata[imageUploadResponseIndex].description = description;
    tokenMetadata[imageUploadResponseIndex].image = `https://ipfs.io/ipfs/${imageUploadResponses[imageUploadResponseIndex].IpfsHash}`;
    tokenMetadata[imageUploadResponseIndex].attributes = thc[temp2].attributes;
    console.log(`${temp2} https://ipfs.io/ipfs/${imageUploadResponses[imageUploadResponseIndex].IpfsHash}`)
   
   //creates metadata and writes files to local
    fs.writeFileSync(
      `./metadata/${temp2}.json`,
      JSON.stringify(tokenMetadata[imageUploadResponseIndex], null, 2)
    );
  }
}

//function for uploading images from local to ipfs returning hashes
async function storeImages() {
  const fullImagePath = path.resolve(location);
  const files = fs.readdirSync(fullImagePath);
  console.log(files);
  let responses = [];
  console.log("Uploading To IPFS!");
  for (fileIndex in files) {
    console.log(`Working on ${fileIndex}.......`);
    const readableStreamForFile = fs.createReadStream(
      `${fullImagePath}/${files[fileIndex]}`
    );

    try {
      const response = await pinata.pinFileToIPFS(readableStreamForFile);
      console.log(response);
      responses.push(response);
    } catch (err) {
      console.log(err);
    }
    console.log(`Uploading Finished for ${fileIndex}..........`);
  }
  console.log("All Uploading Has Been Completed!");

  return { responses, files };
}

editJson();

// async function handleTokenUris() {
//   tokenUris = [];
//   const { responses: imageUploadResponses, files } = await storeImages(
//     imageLocation
//   );

//   for (imageUploadResponseIndex in imageUploadResponses) {
//     let tokenUriMetadata = { ...metadataTemplate };
//     tokenUriMetadata.name = files[imageUploadResponseIndex].replace(".png", "");
//     tokenUriMetadata.description = `An adorable ${tokenUriMetadata.name} pup!`;
//     tokenUriMetadata.image = `ipfs://${imageUploadResponses[imageUploadResponseIndex].IpfsHash}`;
//     console.log(`Uploading ${tokenUriMetadata.name}...`);
//     const metadataUploadResponse = await storeTokeUriMetadata(tokenUriMetadata);
//     tokenUris.push(`ipfs://${metadataUploadResponse.IpfsHash}`);
//   }
//   console.log("Token URIs uploaded! They are:");
//   console.log(tokenUris);
//   return tokenUris;
// }

