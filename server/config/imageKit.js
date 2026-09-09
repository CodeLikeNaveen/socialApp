import ImageKit from '@imagekit/nodejs';
import fs from 'fs';
const imagekit = new ImageKit({
    privateKey: process.env['IMAGEKIT_PRIVATE_KEY'], // This is the default and can be omitted
});

const createFileUrl = async (file, width) => {

    if(!file) return null

    const response = await imagekit.files.upload({
        file: fs.createReadStream(file.path),
        fileName: file.originalname
    })
    
    const fileUrl = await imagekit.helper.buildSrc({
        urlEndpoint: 'https://ik.imagekit.io/vhjgzum1h',
        src: response.filePath,
        transformation: [
            {
                quality: 'auto',
                format: 'webp',
                width: width,
            },
        ],
    });
    return fileUrl;
}

export default createFileUrl