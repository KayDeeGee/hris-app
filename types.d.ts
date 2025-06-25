// types.d.ts
export {};

declare global {
    interface JobApplication {
        id: number;
        job_post_id: number;
        user_id: number;
        cover_letter: string;
        resume_path: string;
        status: string;
        applied_at: string;
        created_at: string;
        updated_at: string;
    }
}
