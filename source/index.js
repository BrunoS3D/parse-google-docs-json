const json2md = require("json2md");
const googleapis = require("googleapis");

const { google } = googleapis;

const { convertGoogleDocumentToJson } = require("./parser.js");

async function parseGoogleDocs(configuration = {}) {
    const docsInstance =
        configuration.docs ||
        google.docs({
            version: "v1",
        });
    const documentId = configuration.documentId;

    if (!documentId) {
        throw new Error('Please, provide "documentId" in the constructor');
    }

    const docsResponse = await docsInstance.documents.get({
        documentId: documentId,
    });

    function toJson(removeEmptyParagraphs = false) {
        const jsonDocument = convertGoogleDocumentToJson(docsResponse.data);

        if (removeEmptyParagraphs) {
            jsonDocument.content = jsonDocument.content.filter((el) => !("p" in el) || el["p"] !== "");
        }

        return {
            metadata: { title: docsResponse.data.title },
            ...jsonDocument,
        };
    }

    function toMarkdown(removeEmptyParagraphs = false) {
        const jsonContent = convertGoogleDocumentToJson(docsResponse.data).content;

        if (removeEmptyParagraphs) {
            jsonContent = jsonContent.filter((el) => !("p" in el) || el["p"] !== "");
        }

        return json2md(jsonContent);
    }

    return {
        toJson,
        toMarkdown,
    };
}

module.exports = parseGoogleDocs;
