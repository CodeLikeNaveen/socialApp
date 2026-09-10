import ImageKit from '@imagekit/nodejs';
import fs from 'fs';
const imagekit = new ImageKit({
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY, // This is the default and can be omitted
});

export const createFileUrl = async (file, width) => {

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

export const createPostImageUrl = async (file, width=1280) => {

    if(!file) return null

    const response = await imagekit.files.upload({
        file: fs.createReadStream(file.path),
        fileName: file.originalname,
        folder: "posts"
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

export const createStoryMediaUrl = async (file) => {

    if(!file) return null

    const response = await imagekit.files.upload({
        file: fs.createReadStream(file.path),
        fileName: file.originalname,
        folder: "story"
    })   
    return response.url;
}

export const createMessageFileUrl = async (file, width=1280) => {

    if(!file) return null

    const response = await imagekit.files.upload({
        file: fs.createReadStream(file.path),
        fileName: file.originalname,
        folder: 'message'
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