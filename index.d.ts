declare module "parse-google-docs-json" {
    interface Configuration {
        docs?: any;
        documentId?: string;
    }

    namespace parseGoogleDocs {}

    function parseGoogleDocs(
        configuration?: Configuration
    ): {
        toJson: () => {
            cover: {
                image: string;
                title: string;
                alt: string;
            };
            content: any[];
            metadata: {
                title: string;
            };
        };
        toMarkdown: () => string;
    };

    export = parseGoogleDocs;
}
