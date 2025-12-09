import { db } from '../config/database';
import { documents, Document, NewDocument } from '../config/schema';
import { eq, desc } from 'drizzle-orm';

export class DocumentModel {
    // Create new document
    static async create(data: NewDocument): Promise<Document> {
        const [document] = await db.insert(documents).values(data).returning();
        return document;
    }

    // Get all documents
    static async findAll(): Promise<Document[]> {
        return await db
            .select()
            .from(documents)
            .orderBy(desc(documents.created_at));
    }

    // Get document by ID
    static async findById(id: number): Promise<Document | undefined> {
        const [document] = await db
            .select()
            .from(documents)
            .where(eq(documents.id, id))
            .limit(1);
        return document;
    }

    // Check if filename exists
    static async findByFilename(filename: string): Promise<Document | undefined> {
        const [document] = await db
            .select()
            .from(documents)
            .where(eq(documents.filename, filename))
            .limit(1);
        return document;
    }

    // Delete document by ID
    static async deleteById(id: number): Promise<boolean> {
        const result = await db
            .delete(documents)
            .where(eq(documents.id, id))
            .returning();
        return result.length > 0;
    }
}