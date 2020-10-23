const googleapis = require("googleapis");
const { google } = googleapis;

const { convertGoogleDocumentToJson, convertJsonToMarkdown } = require("./parser.js");

const docs = google.docs({
    version: "v1",
});

async function parseGoogleDocs(configuration = {}) {
    const documentId = configuration.documentId;

    if (!documentId) {
        throw new Error('Please, provide "documentId" in the constructor');
    }

    const docsResponse = await docs.documents.get({
        documentId: documentId,
    });

    function toJson() {
        const jsonDocument = convertGoogleDocumentToJson(docsResponse.data);

        return {
            metadata: { title: docsResponse.data.title },
            ...jsonDocument,
        };
    }

    function toMarkdown() {
        const documentInJson = convertGoogleDocumentToJson(docsResponse.data);
        return convertJsonToMarkdown(documentInJson);
    }

    return {
        toJson,
        toMarkdown,
    };
}

module.exports = parseGoogleDocs;
