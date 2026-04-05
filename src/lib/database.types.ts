export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      capsules: {
        Row: {
          id: string;
          title: string;
          creator_name: string;
          creator_email: string;
          open_at: string;
          status: "collecting" | "sealed" | "opened";
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          creator_name: string;
          creator_email: string;
          open_at: string;
          status?: "collecting" | "sealed" | "opened";
          created_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          creator_name?: string;
          creator_email?: string;
          open_at?: string;
          status?: "collecting" | "sealed" | "opened";
          created_at?: string;
        };
        Relationships: [];
      };
      contributions: {
        Row: {
          id: string;
          capsule_id: string;
          nickname: string;
          email: string;
          message: string | null;
          photos: string[];
          created_at: string;
        };
        Insert: {
          id?: string;
          capsule_id: string;
          nickname: string;
          email: string;
          message?: string | null;
          photos: string[];
          created_at?: string;
        };
        Update: {
          id?: string;
          capsule_id?: string;
          nickname?: string;
          email?: string;
          message?: string | null;
          photos?: string[];
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "contributions_capsule_id_fkey";
            columns: ["capsule_id"];
            isOneToOne: false;
            referencedRelation: "capsules";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
  storage: {
    Tables: Record<string, never>;
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
