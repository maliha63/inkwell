import conf from '../conf/conf.js';
import { Client, ID, Databases, Storage, Query } from "appwrite";

export class Service{
    client = new Client();
    databases;
    bucket;
    
    constructor(){
        this.client
        .setEndpoint(conf.appwriteUrl)
        .setProject(conf.appwriteProjectId);
        this.databases = new Databases(this.client);
        this.bucket = new Storage(this.client);
    }

   async createPost({ title, slug, content, featuredImage, status, userId }) {
    try {
        // Trim slug to 36 chars max and ensure valid characters
        const safeSlug = slug.replace(/[^a-zA-Z0-9._-]/g, '-').slice(0, 36)
        
        return await this.databases.createDocument(
            conf.appwriteDatabaseId,
            conf.appwriteTableId,
            safeSlug,  //  safeSlug instead of slug
            {
                title,
                content,
                featuredImage,
                status,
                userId,
            }
        )
    } catch (error) {
        console.log("Appwrite service :: createPost :: error", error);
    }
}

    async updatePost(slug, {title, content, featuredImage, status}){
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

    async deletePost(slug){
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

    async getPost(slug){
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

    async getPosts(queries = [Query.equal("status", "active")]){
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

    async uploadFile(file){
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

    async deleteFile(fileId){
        try {
            await this.bucket.deleteFile(
                conf.appwriteBucketId,
                fileId
            )
            return true
        } catch (error) {
            console.log("Appwrite service :: deleteFile :: error", error);
            return false
        }
    }

getFilePreview(fileId){
    return this.bucket.getFileView(  
        conf.appwriteBucketId,
        fileId
    ).toString()
}
}



const service = new Service()
export default service