import PdfPrinter from "pdfmake"
import striptags from "striptags"
import axios from "axios"
import { Post } from "../interfaces"
import { TDocumentDefinitions } from "pdfmake/interfaces"

const fonts = {
    Roboto: {
      normal: "Helvetica",
      bold: "Helvetica-Bold",
      italics: "Helvetica-Oblique",
      bolditalics: "Helvetica-BoldOblique",
    },
  }
  
  const printer = new PdfPrinter(fonts)
  
  export const generatePostPDF = async (post: Post) => {
    
    if (post.cover) {
      const response = await axios.get(post.cover, {
        responseType: "arraybuffer",
      })
      const postCoverURLParts = post.cover.split("/")
      const fileName = postCoverURLParts[postCoverURLParts.length - 1]
      const [id, extension] = fileName.split(".")
      const base64 = response.data.toString("base64")
      const base64Image = `data:image/${extension}base64,${base64}`
      const imagePath = { image: base64Image, width: 500, margin: [0, 0, 0, 40] }
    }

    const docDefinition: TDocumentDefinitions  = {
      content: [
    
        { text: striptags(post.text), lineHeight: 2 },
      ],
    }

    const pdfDoc = printer.createPdfKitDocument(docDefinition)
    return pdfDoc

  }