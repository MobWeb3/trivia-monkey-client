import { GenericFile, Umi } from "@metaplex-foundation/umi";

export async function uploadFile(umi: Umi, file: File) {
    if (file) {
        console.log("file: ", file);
        let uint8Array = await file.arrayBuffer();
        const fileBuffer = new Uint8Array(uint8Array);
        const genericFile: GenericFile = {
            buffer: fileBuffer,
            fileName: file.name,
            displayName: 'sddsdd',
            uniqueName: file.name,
            contentType: null,
            extension: null,
            tags: []
        };

        try {
            const [fileUri] = await umi.uploader.upload([genericFile]);
            console.log("fileUri", fileUri);
            return fileUri;
        }
        catch (error) {
            console.log("error: ", error);
        }
    }
}