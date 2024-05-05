import {Client} from 'react-native-appwrite';
import {Account, Avatars, Databases, ID, Query, Storage} from "react-native-appwrite/src";

export const config = {
    endpoint: "https://cloud.appwrite.io/v1",
    platform: "com.ares1377.aora",
    projectId: "6631ec780009308078b4",
    storageId: "6631f225001f316eab85",
    databaseId: "6631ef89001230c7caea",
    userCollectionId: "6631efe4002f750d13de",
    videoCollectionId: "6631f011001a8c559664",
};

const {
    endpoint,
    platform,
    projectId,
    storageId,
    databaseId,
    userCollectionId,
    videoCollectionId,
} = config


// Init your react-native SDK
const client = new Client();

client
    .setEndpoint(endpoint) // Your Appwrite Endpoint
    .setProject(projectId) // Your project ID
    .setPlatform(platform) // Your application ID or bundle ID.
;

const account = new Account(client);
const avatar = new Avatars(client)
const databases = new Databases(client)
const storage = new Storage(client)


export const createUser = async (email, password, username) => {
    try {
        const newAccount = await account.create(
            ID.unique(),
            email,
            password,
            username
        )

        if (!newAccount) throw Error

        const avatarUrl = await avatar.getInitials(username)

        await signIn(email, password)


        return await databases.createDocument(
            databaseId,
            userCollectionId,
            ID.unique(),
            {
                acountId: newAccount.$id,
                username,
                email,
                avatar: avatarUrl
            }
        )

    } catch (e) {
        console.log(e)
        throw e
    }
}

export const signIn = async (email, password) => {
    try {
        return await account.createEmailSession(email, password)
    } catch (e) {
        console.log(e)
        throw e
    }
}

export const getCurrentUser = async () => {
    try {
        const currentAccount = await account.get()

        if (!currentAccount) throw Error

        const currentUser = await databases.listDocuments(
            databaseId,
            userCollectionId,
            [Query.equal("acountId", currentAccount.$id)]
        )

        if (!currentUser) throw Error

        return currentUser.documents[0]
    } catch (e) {
        console.log(e)
        throw e
    }
}

export const getAllPosts = async () => {
    try {
        const posts = await databases.listDocuments(databaseId, videoCollectionId)

        return posts.documents
    } catch (e) {
        console.log(e)
        throw e
    }
}

export const getLatestPosts = async () => {
    try {
        const posts = await databases.listDocuments(
            databaseId,
            videoCollectionId,
            [Query.orderDesc("$createdAt"), Query.limit(7)]
        )

        return posts.documents
    } catch (e) {
        console.log(e)
        throw e
    }
}

export const searchPosts = async (query) => {
    try {
        const posts = await databases.listDocuments(
            databaseId,
            videoCollectionId,
            [Query.search("title", query)]
        )

        return posts.documents
    } catch (e) {
        console.log(e)
        throw e
    }
}

export const getUserPosts = async (userId) => {
    try {
        const posts = await databases.listDocuments(
            databaseId,
            videoCollectionId,
            [Query.equal("creator", userId)]
        )

        return posts.documents
    } catch (e) {
        console.log(e)
        throw e
    }
}

export const signOut = async () => {
    try {
        return await account.deleteSession('current')
    } catch (e) {
        console.log(e)
        throw e
    }
}


export const getUploadedFile = async (fileId, type) => {

    let fileUrl;
    try {
        if (type === "video") {
            fileUrl = await storage.getFileView(storageId, fileId)
        }else if (type === "image") {
            fileUrl = await storage.getFilePreview(storageId, fileId, 2000, 2000, "top", 100)
        }else {
            throw new Error("Invalid file type")
        }

        if (!fileUrl) throw Error

        return fileUrl
    } catch (e) {
        console.log(e)
        throw e
    }
}

export const uploadFile = async (file, type) => {
    try {
        if (!file) return

        const {mimeType, ...rest} = file
        const asset = {type: mimeType, ...rest}

        const uploadedFile = await storage.createFile(
            storageId,
            ID.unique(),
            asset
        )

        return await getUploadedFile(uploadedFile.$id, type)

    } catch (e) {
        console.log(e)
        throw e
    }
}


export const createVideoPost = async (form) => {
    const {title, video, thumbnail, prompt, userId} = form
    try {
        const [thumbnailUrl, videoUrl] = await Promise.all([
            uploadFile(thumbnail, "image"),
            uploadFile(video, "video")
        ])

        return await databases.createDocument(
            databaseId,
            videoCollectionId,
            ID.unique(),
            {
                title,
                prompt,
                creator: userId,
                video: videoUrl,
                thumbnail: thumbnailUrl
            }
        )
    } catch (e) {
        console.log(e)
        throw e
    }
}

