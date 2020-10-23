const googleapis = require("googleapis");
const { google } = googleapis;

const { convertGoogleDocumentToJson, convertJsonToMarkdown } = require("./parser.js");

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
        const jsonDocument = convertGoogleDocumentToJson(docsResponse.data);

        if (removeEmptyParagraphs) {
            jsonDocument.content = jsonDocument.content.filter((el) => !("p" in el) || el["p"] !== "");
        }

        return convertJsonToMarkdown(jsonDocument);
    }

    return {
        toJson,
        toMarkdown,
    };
}

module.exports = parseGoogleDocs;
