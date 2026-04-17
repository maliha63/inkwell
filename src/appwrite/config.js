import conf from '../conf/conf.js';
import { Client, ID, Databases, Storage, Query } from "appwrite";

export class Service {
    client = new Client();
    databases;
    bucket;

    constructor() {
        this.client
            .setEndpoint(conf.appwriteUrl)
            .setProject(conf.appwriteProjectId);
        this.databases = new Databases(this.client);
        this.bucket = new Storage(this.client);
    }

    // ── Posts ───

    async createPost({ title, slug, content, featuredImage, status, userId }) {
        try {
             // Trim slug to 36 chars max and ensure valid characters
            const safeSlug = slug.replace(/[^a-zA-Z0-9._-]/g, '-').slice(0, 36)
            return await this.databases.createDocument(
                conf.appwriteDatabaseId,
                conf.appwriteTableId,
                safeSlug,//  safeSlug instead of slug
                { title, content, featuredImage, status, userId }
            )
        } catch (error) {
            console.log("Appwrite service :: createPost :: error", error);
        }
    }

    async updatePost(slug, { title, content, featuredImage, status }) {
        try {
            return await this.databases.updateDocument(
                conf.appwriteDatabaseId,
                conf.appwriteTableId,
                slug,
                { title, content, featuredImage, status }
            )
        } catch (error) {
            console.log("Appwrite service :: updatePost :: error", error);
        }
    }

    async deletePost(slug) {
        try {
            await this.databases.deleteDocument(
                conf.appwriteDatabaseId,
                conf.appwriteTableId,
                slug
            )
            return true
        } catch (error) {
            console.log("Appwrite service :: deletePost :: error", error);
            return false
        }
    }

    async getPost(slug) {
        try {
            return await this.databases.getDocument(
                conf.appwriteDatabaseId,
                conf.appwriteTableId,
                slug
            )
        } catch (error) {
            console.log("Appwrite service :: getPost :: error", error);
            return false
        }
    }

    async getPosts(queries = [Query.equal("status", "active")]) {
        try {
            return await this.databases.listDocuments(
                conf.appwriteDatabaseId,
                conf.appwriteTableId,
                queries
            )
        } catch (error) {
            console.log("Appwrite service :: getPosts :: error", error);
            return false
        }
    }

    // ── Files ────
    async uploadFile(file) {
        try {
            return await this.bucket.createFile(
                conf.appwriteBucketId,
                ID.unique(),
                file
            )
        } catch (error) {
            console.log("Appwrite service :: uploadFile :: error", error);
            return false
        }
    }

    async deleteFile(fileId) {
        try {
            await this.bucket.deleteFile(conf.appwriteBucketId, fileId)
            return true
        } catch (error) {
            console.log("Appwrite service :: deleteFile :: error", error);
            return false
        }
    }

    getFilePreview(fileId) {
        return this.bucket.getFileView(
            conf.appwriteBucketId,
            fileId
        ).toString()
    }

    // ── Comments ──────

    async getComments(postId) {
        try {
            return await this.databases.listDocuments(
                conf.appwriteDatabaseId,
                conf.appwriteCommentsId,
                [
                    Query.equal("postId", postId),
                    Query.orderDesc("createdAt"),
                    Query.limit(100),
                ]
            )
        } catch (error) {
            console.log("Appwrite service :: getComments :: error", error);
            return null
        }
    }

    async createComment({ postId, content, authorName, authorId }) {
        try {
            return await this.databases.createDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCommentsId,
                ID.unique(),
                {
                    postId,
                    content,
                    authorName,
                    authorId,
                    createdAt: new Date().toISOString(),
                }
            )
        } catch (error) {
            console.log("Appwrite service :: createComment :: error", error);
            return null
        }
    }

    async deleteComment(commentId) {
        try {
            await this.databases.deleteDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCommentsId,
                commentId
            )
            return true
        } catch (error) {
            console.log("Appwrite service :: deleteComment :: error", error);
            return false
        }
    }
}

const service = new Service()
export default service