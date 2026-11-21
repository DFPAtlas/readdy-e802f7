// Payment webhook schema subset generated from the linked database on 2026-11-21.
// RPC additions correspond to 20261121005544_repair_stripe_atomicity_and_staff_roles.sql.
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];
export type PaymentDatabase = {
  public: {
    Tables: {
      clients: {
        Row: {
          stripe_customer_id: string | null
          account_manager: string | null
          address: string | null
          archived_at: string | null
          attention_needed: boolean | null
          attention_reasons: Json | null
          billing_contact_id: string | null
          billing_currency: string | null
          client_reference: string | null
          client_type: string | null
          company_name: string | null
          company_number: string | null
          contact_name: string | null
          created_at: string
          data_classification: string | null
          email: string | null
          health_calculated_at: string | null
          health_factors: Json | null
          health_status: string | null
          id: string
          industry: string | null
          last_activity_at: string | null
          lead_id: string | null
          notes: string | null
          offboarding_state: string | null
          onboarding_state: string | null
          phone: string | null
          portal_access_state: string | null
          preferred_contact_method: string | null
          project_lead: string | null
          service_owner: string | null
          service_renewal_date: string | null
          service_start_date: string | null
          status: string
          timezone: string | null
          trading_name: string | null
          updated_at: string
          user_id: string | null
          vat_number: string | null
          website: string | null
        }
        Insert: {
          stripe_customer_id?: string | null
          account_manager?: string | null
          address?: string | null
          archived_at?: string | null
          attention_needed?: boolean | null
          attention_reasons?: Json | null
          billing_contact_id?: string | null
          billing_currency?: string | null
          client_reference?: string | null
          client_type?: string | null
          company_name?: string | null
          company_number?: string | null
          contact_name?: string | null
          created_at?: string
          data_classification?: string | null
          email?: string | null
          health_calculated_at?: string | null
          health_factors?: Json | null
          health_status?: string | null
          id?: string
          industry?: string | null
          last_activity_at?: string | null
          lead_id?: string | null
          notes?: string | null
          offboarding_state?: string | null
          onboarding_state?: string | null
          phone?: string | null
          portal_access_state?: string | null
          preferred_contact_method?: string | null
          project_lead?: string | null
          service_owner?: string | null
          service_renewal_date?: string | null
          service_start_date?: string | null
          status?: string
          timezone?: string | null
          trading_name?: string | null
          updated_at?: string
          user_id?: string | null
          vat_number?: string | null
          website?: string | null
        }
        Update: {
          stripe_customer_id?: string | null
          account_manager?: string | null
          address?: string | null
          archived_at?: string | null
          attention_needed?: boolean | null
          attention_reasons?: Json | null
          billing_contact_id?: string | null
          billing_currency?: string | null
          client_reference?: string | null
          client_type?: string | null
          company_name?: string | null
          company_number?: string | null
          contact_name?: string | null
          created_at?: string
          data_classification?: string | null
          email?: string | null
          health_calculated_at?: string | null
          health_factors?: Json | null
          health_status?: string | null
          id?: string
          industry?: string | null
          last_activity_at?: string | null
          lead_id?: string | null
          notes?: string | null
          offboarding_state?: string | null
          onboarding_state?: string | null
          phone?: string | null
          portal_access_state?: string | null
          preferred_contact_method?: string | null
          project_lead?: string | null
          service_owner?: string | null
          service_renewal_date?: string | null
          service_start_date?: string | null
          status?: string
          timezone?: string | null
          trading_name?: string | null
          updated_at?: string
          user_id?: string | null
          vat_number?: string | null
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "clients_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "clients_project_lead_fkey"
            columns: ["project_lead"]
            isOneToOne: false
            referencedRelation: "staff_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          actual_completion_date: string | null
          ai_welcome_message: string | null
          archived_at: string | null
          assigned_staff: string[]
          budget: number
          client_facing_summary: string | null
          client_id: string | null
          client_visible: boolean
          completed_at: string | null
          created_at: string | null
          current_phase: string | null
          description: string | null
          domain: string | null
          end_date: string | null
          environment: string | null
          featured: boolean
          health: string | null
          id: string
          launch_conditions: Json | null
          launch_state: string | null
          live_url: string | null
          name: string
          objective: string | null
          organisation_id: string | null
          preview_image: string | null
          primary_color: string | null
          priority: string
          progress: number
          progress_method: string | null
          project_lead: string | null
          project_reference: string | null
          project_type: string | null
          related_services: Json | null
          slug: string | null
          staging_url: string | null
          start_date: string | null
          status: string | null
          system_prompt: string | null
          total_budget: number
          uat_state: string | null
          updated_at: string
        }
        Insert: {
          actual_completion_date?: string | null
          ai_welcome_message?: string | null
          archived_at?: string | null
          assigned_staff?: string[]
          budget?: number
          client_facing_summary?: string | null
          client_id?: string | null
          client_visible?: boolean
          completed_at?: string | null
          created_at?: string | null
          current_phase?: string | null
          description?: string | null
          domain?: string | null
          end_date?: string | null
          environment?: string | null
          featured?: boolean
          health?: string | null
          id?: string
          launch_conditions?: Json | null
          launch_state?: string | null
          live_url?: string | null
          name: string
          objective?: string | null
          organisation_id?: string | null
          preview_image?: string | null
          primary_color?: string | null
          priority?: string
          progress?: number
          progress_method?: string | null
          project_lead?: string | null
          project_reference?: string | null
          project_type?: string | null
          related_services?: Json | null
          slug?: string | null
          staging_url?: string | null
          start_date?: string | null
          status?: string | null
          system_prompt?: string | null
          total_budget?: number
          uat_state?: string | null
          updated_at?: string
        }
        Update: {
          actual_completion_date?: string | null
          ai_welcome_message?: string | null
          archived_at?: string | null
          assigned_staff?: string[]
          budget?: number
          client_facing_summary?: string | null
          client_id?: string | null
          client_visible?: boolean
          completed_at?: string | null
          created_at?: string | null
          current_phase?: string | null
          description?: string | null
          domain?: string | null
          end_date?: string | null
          environment?: string | null
          featured?: boolean
          health?: string | null
          id?: string
          launch_conditions?: Json | null
          launch_state?: string | null
          live_url?: string | null
          name?: string
          objective?: string | null
          organisation_id?: string | null
          preview_image?: string | null
          primary_color?: string | null
          priority?: string
          progress?: number
          progress_method?: string | null
          project_lead?: string | null
          project_reference?: string | null
          project_type?: string | null
          related_services?: Json | null
          slug?: string | null
          staging_url?: string | null
          start_date?: string | null
          status?: string | null
          system_prompt?: string | null
          total_budget?: number
          uat_state?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "projects_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projects_project_lead_fkey"
            columns: ["project_lead"]
            isOneToOne: false
            referencedRelation: "staff_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      milestones: {
        Row: {
          stripe_checkout_session_id: string | null
          stripe_refunded_minor: number
          amount: number | null
          blocked_reason: string | null
          cancelled_reason: string | null
          client_visible: boolean
          completed_at_time: string | null
          completion_criteria: string | null
          created_at: string | null
          dependency_id: string | null
          description: string | null
          due_date: string | null
          evidence: string | null
          id: string
          name: string | null
          order_index: number | null
          owner_id: string | null
          paid_at: string | null
          payment_status: string | null
          project_id: string | null
          sort_order: number
          status: string | null
          stripe_payment_id: string | null
          target_date: string | null
          title: string | null
          updated_at: string
        }
        Insert: {
          stripe_checkout_session_id?: string | null
          stripe_refunded_minor?: number
          amount?: number | null
          blocked_reason?: string | null
          cancelled_reason?: string | null
          client_visible?: boolean
          completed_at_time?: string | null
          completion_criteria?: string | null
          created_at?: string | null
          dependency_id?: string | null
          description?: string | null
          due_date?: string | null
          evidence?: string | null
          id?: string
          name?: string | null
          order_index?: number | null
          owner_id?: string | null
          paid_at?: string | null
          payment_status?: string | null
          project_id?: string | null
          sort_order?: number
          status?: string | null
          stripe_payment_id?: string | null
          target_date?: string | null
          title?: string | null
          updated_at?: string
        }
        Update: {
          stripe_checkout_session_id?: string | null
          stripe_refunded_minor?: number
          amount?: number | null
          blocked_reason?: string | null
          cancelled_reason?: string | null
          client_visible?: boolean
          completed_at_time?: string | null
          completion_criteria?: string | null
          created_at?: string | null
          dependency_id?: string | null
          description?: string | null
          due_date?: string | null
          evidence?: string | null
          id?: string
          name?: string | null
          order_index?: number | null
          owner_id?: string | null
          paid_at?: string | null
          payment_status?: string | null
          project_id?: string | null
          sort_order?: number
          status?: string | null
          stripe_payment_id?: string | null
          target_date?: string | null
          title?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "milestones_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      admin_profiles: {
        Row: {
          active: boolean
          archive_reason: string | null
          archived_at: string | null
          created_at: string | null
          created_by: string | null
          department_id: string | null
          email: string
          engagement_end: string | null
          engagement_start: string | null
          engagement_type: string | null
          full_name: string | null
          id: string
          identity_type: string | null
          last_login_at: string | null
          manager_id: string | null
          mfa_state: string | null
          organisation_id: string | null
          phone_work: string | null
          portfolio_company: string | null
          reference: string | null
          review_date: string | null
          role: string
          status: string | null
          suspended_at: string | null
          suspension_reason: string | null
          team_id: string | null
          timezone: string | null
          title: string | null
          updated_at: string | null
        }
        Insert: {
          active?: boolean
          archive_reason?: string | null
          archived_at?: string | null
          created_at?: string | null
          created_by?: string | null
          department_id?: string | null
          email: string
          engagement_end?: string | null
          engagement_start?: string | null
          engagement_type?: string | null
          full_name?: string | null
          id: string
          identity_type?: string | null
          last_login_at?: string | null
          manager_id?: string | null
          mfa_state?: string | null
          organisation_id?: string | null
          phone_work?: string | null
          portfolio_company?: string | null
          reference?: string | null
          review_date?: string | null
          role?: string
          status?: string | null
          suspended_at?: string | null
          suspension_reason?: string | null
          team_id?: string | null
          timezone?: string | null
          title?: string | null
          updated_at?: string | null
        }
        Update: {
          active?: boolean
          archive_reason?: string | null
          archived_at?: string | null
          created_at?: string | null
          created_by?: string | null
          department_id?: string | null
          email?: string
          engagement_end?: string | null
          engagement_start?: string | null
          engagement_type?: string | null
          full_name?: string | null
          id?: string
          identity_type?: string | null
          last_login_at?: string | null
          manager_id?: string | null
          mfa_state?: string | null
          organisation_id?: string | null
          phone_work?: string | null
          portfolio_company?: string | null
          reference?: string | null
          review_date?: string | null
          role?: string
          status?: string | null
          suspended_at?: string | null
          suspension_reason?: string | null
          team_id?: string | null
          timezone?: string | null
          title?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      staff_profiles: {
        Row: {
          active: boolean
          archive_reason: string | null
          archived_at: string | null
          created_at: string | null
          department_id: string | null
          email: string
          engagement_end: string | null
          engagement_start: string | null
          engagement_type: string | null
          full_name: string | null
          id: string
          identity_type: string | null
          last_login_at: string | null
          manager_id: string | null
          mfa_state: string | null
          organisation_id: string | null
          phone: string | null
          phone_work: string | null
          portfolio_company: string | null
          reference: string | null
          review_date: string | null
          role: string
          status: string
          suspended_at: string | null
          suspension_reason: string | null
          team_id: string | null
          timezone: string | null
          title: string | null
          updated_at: string | null
        }
        Insert: {
          active?: boolean
          archive_reason?: string | null
          archived_at?: string | null
          created_at?: string | null
          department_id?: string | null
          email: string
          engagement_end?: string | null
          engagement_start?: string | null
          engagement_type?: string | null
          full_name?: string | null
          id: string
          identity_type?: string | null
          last_login_at?: string | null
          manager_id?: string | null
          mfa_state?: string | null
          organisation_id?: string | null
          phone?: string | null
          phone_work?: string | null
          portfolio_company?: string | null
          reference?: string | null
          review_date?: string | null
          role?: string
          status?: string
          suspended_at?: string | null
          suspension_reason?: string | null
          team_id?: string | null
          timezone?: string | null
          title?: string | null
          updated_at?: string | null
        }
        Update: {
          active?: boolean
          archive_reason?: string | null
          archived_at?: string | null
          created_at?: string | null
          department_id?: string | null
          email?: string
          engagement_end?: string | null
          engagement_start?: string | null
          engagement_type?: string | null
          full_name?: string | null
          id?: string
          identity_type?: string | null
          last_login_at?: string | null
          manager_id?: string | null
          mfa_state?: string | null
          organisation_id?: string | null
          phone?: string | null
          phone_work?: string | null
          portfolio_company?: string | null
          reference?: string | null
          review_date?: string | null
          role?: string
          status?: string
          suspended_at?: string | null
          suspension_reason?: string | null
          team_id?: string | null
          timezone?: string | null
          title?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      project_access: {
        Row: {
          access_level: string
          access_role: string
          client_id: string | null
          created_at: string | null
          id: string
          project_id: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          access_level?: string
          access_role?: string
          client_id?: string | null
          created_at?: string | null
          id?: string
          project_id: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          access_level?: string
          access_role?: string
          client_id?: string | null
          created_at?: string | null
          id?: string
          project_id?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_access_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_access_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      invoices: {
        Row: {
          amount: number
          amount_outstanding: number | null
          amount_paid: number | null
          amount_paid_minor: number | null
          approved_at: string | null
          approved_by: string | null
          archived_at: string | null
          assignment_id: string | null
          balance_due: number | null
          balance_due_minor: number | null
          billing_address_snapshot: string | null
          billing_contact_id: string | null
          cancellation_reason: string | null
          cancelled_at: string | null
          client_id: string | null
          client_notes: string | null
          created_at: string | null
          created_by: string | null
          currency: string
          customer_email_snapshot: string | null
          customer_id: string | null
          customer_name_snapshot: string | null
          customer_phone_snapshot: string | null
          delivery_sent_at: string | null
          delivery_status: string | null
          description: string
          discount: number | null
          dispute_reason: string | null
          disputed_at: string | null
          due_date: string | null
          fleet_account_id: string | null
          freelancer_id: string | null
          garage_details_snapshot: string | null
          garage_id: string | null
          gross_total_minor: number | null
          id: string
          internal_notes: string | null
          invoice_number: string
          issue_date: string | null
          issued_at: string | null
          job_id: string | null
          last_reminder_sent: string | null
          net_total_minor: number | null
          notes: string | null
          organisation_id: string | null
          paid_amount: number | null
          paid_at: string | null
          payment_terms: string | null
          project_id: string | null
          purchase_order_reference: string | null
          quote_id: string | null
          reference: string | null
          service_id: string | null
          status: string
          stripe_checkout_session_id: string | null
          stripe_payment_intent_id: string | null
          subtotal: number | null
          tax: number | null
          tax_inclusive: boolean | null
          tax_point_date: string | null
          tax_rate: number | null
          total: number | null
          total_amount: number | null
          type: string
          updated_at: string
          vat_amount: number | null
          vat_rate: number | null
          vat_total_minor: number | null
          vehicle_id: string | null
          vehicle_snapshot: string | null
          void_reason: string | null
          voided_at: string | null
          write_off_reason: string | null
          written_off_at: string | null
        }
        Insert: {
          amount?: number
          amount_outstanding?: number | null
          amount_paid?: number | null
          amount_paid_minor?: number | null
          approved_at?: string | null
          approved_by?: string | null
          archived_at?: string | null
          assignment_id?: string | null
          balance_due?: number | null
          balance_due_minor?: number | null
          billing_address_snapshot?: string | null
          billing_contact_id?: string | null
          cancellation_reason?: string | null
          cancelled_at?: string | null
          client_id?: string | null
          client_notes?: string | null
          created_at?: string | null
          created_by?: string | null
          currency?: string
          customer_email_snapshot?: string | null
          customer_id?: string | null
          customer_name_snapshot?: string | null
          customer_phone_snapshot?: string | null
          delivery_sent_at?: string | null
          delivery_status?: string | null
          description?: string
          discount?: number | null
          dispute_reason?: string | null
          disputed_at?: string | null
          due_date?: string | null
          fleet_account_id?: string | null
          freelancer_id?: string | null
          garage_details_snapshot?: string | null
          garage_id?: string | null
          gross_total_minor?: number | null
          id?: string
          internal_notes?: string | null
          invoice_number: string
          issue_date?: string | null
          issued_at?: string | null
          job_id?: string | null
          last_reminder_sent?: string | null
          net_total_minor?: number | null
          notes?: string | null
          organisation_id?: string | null
          paid_amount?: number | null
          paid_at?: string | null
          payment_terms?: string | null
          project_id?: string | null
          purchase_order_reference?: string | null
          quote_id?: string | null
          reference?: string | null
          service_id?: string | null
          status?: string
          stripe_checkout_session_id?: string | null
          stripe_payment_intent_id?: string | null
          subtotal?: number | null
          tax?: number | null
          tax_inclusive?: boolean | null
          tax_point_date?: string | null
          tax_rate?: number | null
          total?: number | null
          total_amount?: number | null
          type?: string
          updated_at?: string
          vat_amount?: number | null
          vat_rate?: number | null
          vat_total_minor?: number | null
          vehicle_id?: string | null
          vehicle_snapshot?: string | null
          void_reason?: string | null
          voided_at?: string | null
          write_off_reason?: string | null
          written_off_at?: string | null
        }
        Update: {
          amount?: number
          amount_outstanding?: number | null
          amount_paid?: number | null
          amount_paid_minor?: number | null
          approved_at?: string | null
          approved_by?: string | null
          archived_at?: string | null
          assignment_id?: string | null
          balance_due?: number | null
          balance_due_minor?: number | null
          billing_address_snapshot?: string | null
          billing_contact_id?: string | null
          cancellation_reason?: string | null
          cancelled_at?: string | null
          client_id?: string | null
          client_notes?: string | null
          created_at?: string | null
          created_by?: string | null
          currency?: string
          customer_email_snapshot?: string | null
          customer_id?: string | null
          customer_name_snapshot?: string | null
          customer_phone_snapshot?: string | null
          delivery_sent_at?: string | null
          delivery_status?: string | null
          description?: string
          discount?: number | null
          dispute_reason?: string | null
          disputed_at?: string | null
          due_date?: string | null
          fleet_account_id?: string | null
          freelancer_id?: string | null
          garage_details_snapshot?: string | null
          garage_id?: string | null
          gross_total_minor?: number | null
          id?: string
          internal_notes?: string | null
          invoice_number?: string
          issue_date?: string | null
          issued_at?: string | null
          job_id?: string | null
          last_reminder_sent?: string | null
          net_total_minor?: number | null
          notes?: string | null
          organisation_id?: string | null
          paid_amount?: number | null
          paid_at?: string | null
          payment_terms?: string | null
          project_id?: string | null
          purchase_order_reference?: string | null
          quote_id?: string | null
          reference?: string | null
          service_id?: string | null
          status?: string
          stripe_checkout_session_id?: string | null
          stripe_payment_intent_id?: string | null
          subtotal?: number | null
          tax?: number | null
          tax_inclusive?: boolean | null
          tax_point_date?: string | null
          tax_rate?: number | null
          total?: number | null
          total_amount?: number | null
          type?: string
          updated_at?: string
          vat_amount?: number | null
          vat_rate?: number | null
          vat_total_minor?: number | null
          vehicle_id?: string | null
          vehicle_snapshot?: string | null
          void_reason?: string | null
          voided_at?: string | null
          write_off_reason?: string | null
          written_off_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "invoices_assignment_id_fkey"
            columns: ["assignment_id"]
            isOneToOne: false
            referencedRelation: "assignments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_freelancer_id_fkey"
            columns: ["freelancer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount: number
          client_id: string | null
          confirmation_reason: string | null
          confirmed_at: string | null
          confirmed_by: string | null
          created_at: string | null
          currency: string
          customer_id: string | null
          external_event_id: string | null
          external_payment_id: string | null
          failure_reason: string | null
          garage_id: string | null
          id: string
          idempotency_key: string | null
          invoice_id: string
          method: string
          notes: string | null
          payment_date: string
          payment_method: string | null
          payment_reference: string | null
          provider: string | null
          provider_event_id: string | null
          provider_payment_id: string | null
          received_at: string | null
          reconciliation_state: string | null
          recorded_by: string | null
          reference: string | null
          refunded_amount_minor: number | null
          status: string
          updated_at: string | null
        }
        Insert: {
          amount: number
          client_id?: string | null
          confirmation_reason?: string | null
          confirmed_at?: string | null
          confirmed_by?: string | null
          created_at?: string | null
          currency?: string
          customer_id?: string | null
          external_event_id?: string | null
          external_payment_id?: string | null
          failure_reason?: string | null
          garage_id?: string | null
          id?: string
          idempotency_key?: string | null
          invoice_id: string
          method?: string
          notes?: string | null
          payment_date?: string
          payment_method?: string | null
          payment_reference?: string | null
          provider?: string | null
          provider_event_id?: string | null
          provider_payment_id?: string | null
          received_at?: string | null
          reconciliation_state?: string | null
          recorded_by?: string | null
          reference?: string | null
          refunded_amount_minor?: number | null
          status?: string
          updated_at?: string | null
        }
        Update: {
          amount?: number
          client_id?: string | null
          confirmation_reason?: string | null
          confirmed_at?: string | null
          confirmed_by?: string | null
          created_at?: string | null
          currency?: string
          customer_id?: string | null
          external_event_id?: string | null
          external_payment_id?: string | null
          failure_reason?: string | null
          garage_id?: string | null
          id?: string
          idempotency_key?: string | null
          invoice_id?: string
          method?: string
          notes?: string | null
          payment_date?: string
          payment_method?: string | null
          payment_reference?: string | null
          provider?: string | null
          provider_event_id?: string | null
          provider_payment_id?: string | null
          received_at?: string | null
          reconciliation_state?: string | null
          recorded_by?: string | null
          reference?: string | null
          refunded_amount_minor?: number | null
          status?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
        ]
      }
      dfp_checkout_orders: {
        Row: {
          billing_address: string
          billing_country: string
          billing_postcode: string | null
          business_name: string | null
          created_at: string
          currency: string
          customer_email: string
          customer_name: string
          customer_phone: string | null
          existing_website: string | null
          final_milestone_minor: number
          full_price_minor: number
          id: string
          package_id: string
          package_name: string
          payment_status: string
          preferred_contact: string
          project_description: string | null
          project_reference: string
          project_status: string
          remaining_balance_minor: number
          second_milestone_minor: number
          starting_payment_minor: number
          stripe_checkout_session_id: string | null
          stripe_customer_id: string | null
          stripe_payment_intent_id: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          billing_address: string
          billing_country?: string
          billing_postcode?: string | null
          business_name?: string | null
          created_at?: string
          currency?: string
          customer_email: string
          customer_name: string
          customer_phone?: string | null
          existing_website?: string | null
          final_milestone_minor: number
          full_price_minor: number
          id?: string
          package_id: string
          package_name: string
          payment_status?: string
          preferred_contact?: string
          project_description?: string | null
          project_reference: string
          project_status?: string
          remaining_balance_minor: number
          second_milestone_minor: number
          starting_payment_minor: number
          stripe_checkout_session_id?: string | null
          stripe_customer_id?: string | null
          stripe_payment_intent_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          billing_address?: string
          billing_country?: string
          billing_postcode?: string | null
          business_name?: string | null
          created_at?: string
          currency?: string
          customer_email?: string
          customer_name?: string
          customer_phone?: string | null
          existing_website?: string | null
          final_milestone_minor?: number
          full_price_minor?: number
          id?: string
          package_id?: string
          package_name?: string
          payment_status?: string
          preferred_contact?: string
          project_description?: string | null
          project_reference?: string
          project_status?: string
          remaining_balance_minor?: number
          second_milestone_minor?: number
          starting_payment_minor?: number
          stripe_checkout_session_id?: string | null
          stripe_customer_id?: string | null
          stripe_payment_intent_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      uat_testers: {
        Row: {
          agreement_status: string | null
          application_reason: string | null
          archived_at: string | null
          archived_reason: string | null
          availability: string[]
          browsers: string[]
          country: string | null
          created_at: string
          current_active_assignments: number | null
          devices: string[]
          display_name: string | null
          email: string
          experience_level: string
          experience_summary: string | null
          full_name: string
          id: string
          industries: string[]
          internal_notes: string | null
          is_over_18: boolean
          last_active_at: string | null
          last_assignment_at: string | null
          max_concurrent_assignments: number | null
          notes: string | null
          onboarding_rejection_reason: string | null
          onboarding_reviewed_at: string | null
          onboarding_reviewed_by: string | null
          onboarding_status: string | null
          organisation_id: string | null
          payment_eligibility: boolean | null
          performance_sample_size: number | null
          phone: string | null
          preferred_payment_method: string | null
          quality_band: string | null
          quality_score: number | null
          reference: string | null
          reliability_band: string | null
          reliability_score: number | null
          restricted_at: string | null
          restricted_reason: string | null
          status: string
          stripe_account_id: string | null
          stripe_account_mode: string | null
          stripe_connect_created_at: string | null
          stripe_connect_updated_at: string | null
          stripe_details_submitted: boolean
          stripe_onboarding_complete: boolean
          stripe_payment_setup_status: string
          stripe_payouts_enabled: boolean
          stripe_requirements_due: Json | null
          stripe_transfers_enabled: boolean
          suspended_at: string | null
          suspended_reason: string | null
          timezone: string | null
          town_city: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          agreement_status?: string | null
          application_reason?: string | null
          archived_at?: string | null
          archived_reason?: string | null
          availability?: string[]
          browsers?: string[]
          country?: string | null
          created_at?: string
          current_active_assignments?: number | null
          devices?: string[]
          display_name?: string | null
          email: string
          experience_level?: string
          experience_summary?: string | null
          full_name: string
          id?: string
          industries?: string[]
          internal_notes?: string | null
          is_over_18?: boolean
          last_active_at?: string | null
          last_assignment_at?: string | null
          max_concurrent_assignments?: number | null
          notes?: string | null
          onboarding_rejection_reason?: string | null
          onboarding_reviewed_at?: string | null
          onboarding_reviewed_by?: string | null
          onboarding_status?: string | null
          organisation_id?: string | null
          payment_eligibility?: boolean | null
          performance_sample_size?: number | null
          phone?: string | null
          preferred_payment_method?: string | null
          quality_band?: string | null
          quality_score?: number | null
          reference?: string | null
          reliability_band?: string | null
          reliability_score?: number | null
          restricted_at?: string | null
          restricted_reason?: string | null
          status?: string
          stripe_account_id?: string | null
          stripe_account_mode?: string | null
          stripe_connect_created_at?: string | null
          stripe_connect_updated_at?: string | null
          stripe_details_submitted?: boolean
          stripe_onboarding_complete?: boolean
          stripe_payment_setup_status?: string
          stripe_payouts_enabled?: boolean
          stripe_requirements_due?: Json | null
          stripe_transfers_enabled?: boolean
          suspended_at?: string | null
          suspended_reason?: string | null
          timezone?: string | null
          town_city?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          agreement_status?: string | null
          application_reason?: string | null
          archived_at?: string | null
          archived_reason?: string | null
          availability?: string[]
          browsers?: string[]
          country?: string | null
          created_at?: string
          current_active_assignments?: number | null
          devices?: string[]
          display_name?: string | null
          email?: string
          experience_level?: string
          experience_summary?: string | null
          full_name?: string
          id?: string
          industries?: string[]
          internal_notes?: string | null
          is_over_18?: boolean
          last_active_at?: string | null
          last_assignment_at?: string | null
          max_concurrent_assignments?: number | null
          notes?: string | null
          onboarding_rejection_reason?: string | null
          onboarding_reviewed_at?: string | null
          onboarding_reviewed_by?: string | null
          onboarding_status?: string | null
          organisation_id?: string | null
          payment_eligibility?: boolean | null
          performance_sample_size?: number | null
          phone?: string | null
          preferred_payment_method?: string | null
          quality_band?: string | null
          quality_score?: number | null
          reference?: string | null
          reliability_band?: string | null
          reliability_score?: number | null
          restricted_at?: string | null
          restricted_reason?: string | null
          status?: string
          stripe_account_id?: string | null
          stripe_account_mode?: string | null
          stripe_connect_created_at?: string | null
          stripe_connect_updated_at?: string | null
          stripe_details_submitted?: boolean
          stripe_onboarding_complete?: boolean
          stripe_payment_setup_status?: string
          stripe_payouts_enabled?: boolean
          stripe_requirements_due?: Json | null
          stripe_transfers_enabled?: boolean
          suspended_at?: string | null
          suspended_reason?: string | null
          timezone?: string | null
          town_city?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      uat_payments: {
        Row: {
          adjustments: Json | null
          admin_notes: string | null
          approved_at: string | null
          approved_by: string | null
          assignment_id: string
          base_amount: number
          bonus_amount: number
          cancellation_reason: string | null
          cancelled_at: string | null
          cancelled_by: string | null
          confirmation_reason: string | null
          confirmed_at: string | null
          confirmed_by: string | null
          created_at: string
          currency: string | null
          dispute_state: string | null
          eligibility_state: string | null
          finance_reference: string | null
          id: string
          idempotency_key: string | null
          job_id: string
          paid_at: string | null
          payment_method: string | null
          payment_reference: string | null
          provider: string | null
          provider_event_id: string | null
          provider_payment_id: string | null
          rejected_at: string | null
          rejected_by: string | null
          rejection_reason: string | null
          reward_amount_minor: number
          reward_snapshot: Json | null
          status: string
          stripe_connected_account_id: string | null
          stripe_last_reconciled_at: string | null
          stripe_transfer_created_at: string | null
          stripe_transfer_failure_code: string | null
          stripe_transfer_failure_message: string | null
          stripe_transfer_id: string | null
          stripe_transfer_idempotency_key: string | null
          stripe_transfer_status: string | null
          tester_id: string
          total_amount: number | null
          updated_at: string
        }
        Insert: {
          adjustments?: Json | null
          admin_notes?: string | null
          approved_at?: string | null
          approved_by?: string | null
          assignment_id: string
          base_amount?: number
          bonus_amount?: number
          cancellation_reason?: string | null
          cancelled_at?: string | null
          cancelled_by?: string | null
          confirmation_reason?: string | null
          confirmed_at?: string | null
          confirmed_by?: string | null
          created_at?: string
          currency?: string | null
          dispute_state?: string | null
          eligibility_state?: string | null
          finance_reference?: string | null
          id?: string
          idempotency_key?: string | null
          job_id: string
          paid_at?: string | null
          payment_method?: string | null
          payment_reference?: string | null
          provider?: string | null
          provider_event_id?: string | null
          provider_payment_id?: string | null
          rejected_at?: string | null
          rejected_by?: string | null
          rejection_reason?: string | null
          reward_amount_minor?: number
          reward_snapshot?: Json | null
          status?: string
          stripe_connected_account_id?: string | null
          stripe_last_reconciled_at?: string | null
          stripe_transfer_created_at?: string | null
          stripe_transfer_failure_code?: string | null
          stripe_transfer_failure_message?: string | null
          stripe_transfer_id?: string | null
          stripe_transfer_idempotency_key?: string | null
          stripe_transfer_status?: string | null
          tester_id: string
          total_amount?: number | null
          updated_at?: string
        }
        Update: {
          adjustments?: Json | null
          admin_notes?: string | null
          approved_at?: string | null
          approved_by?: string | null
          assignment_id?: string
          base_amount?: number
          bonus_amount?: number
          cancellation_reason?: string | null
          cancelled_at?: string | null
          cancelled_by?: string | null
          confirmation_reason?: string | null
          confirmed_at?: string | null
          confirmed_by?: string | null
          created_at?: string
          currency?: string | null
          dispute_state?: string | null
          eligibility_state?: string | null
          finance_reference?: string | null
          id?: string
          idempotency_key?: string | null
          job_id?: string
          paid_at?: string | null
          payment_method?: string | null
          payment_reference?: string | null
          provider?: string | null
          provider_event_id?: string | null
          provider_payment_id?: string | null
          rejected_at?: string | null
          rejected_by?: string | null
          rejection_reason?: string | null
          reward_amount_minor?: number
          reward_snapshot?: Json | null
          status?: string
          stripe_connected_account_id?: string | null
          stripe_last_reconciled_at?: string | null
          stripe_transfer_created_at?: string | null
          stripe_transfer_failure_code?: string | null
          stripe_transfer_failure_message?: string | null
          stripe_transfer_id?: string | null
          stripe_transfer_idempotency_key?: string | null
          stripe_transfer_status?: string | null
          tester_id?: string
          total_amount?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "uat_payments_assignment_id_fkey"
            columns: ["assignment_id"]
            isOneToOne: false
            referencedRelation: "uat_assignments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "uat_payments_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "uat_jobs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "uat_payments_tester_id_fkey"
            columns: ["tester_id"]
            isOneToOne: false
            referencedRelation: "uat_testers"
            referencedColumns: ["id"]
          },
        ]
      }
      uat_audit_log: {
        Row: {
          action: string
          actor_id: string | null
          created_at: string
          entity_id: string | null
          entity_type: string
          id: string
          new_value: Json | null
          previous_value: Json | null
        }
        Insert: {
          action: string
          actor_id?: string | null
          created_at?: string
          entity_id?: string | null
          entity_type: string
          id?: string
          new_value?: Json | null
          previous_value?: Json | null
        }
        Update: {
          action?: string
          actor_id?: string | null
          created_at?: string
          entity_id?: string | null
          entity_type?: string
          id?: string
          new_value?: Json | null
          previous_value?: Json | null
        }
        Relationships: []
      }
      digital_footprint_alerts: {
        Row: {
          alert_type: string
          created_at: string
          description: string | null
          id: string
          is_read: boolean
          is_resolved: boolean
          project_id: string | null
          resolved_at: string | null
          source: string | null
          title: string
          updated_at: string
        }
        Insert: {
          alert_type?: string
          created_at?: string
          description?: string | null
          id?: string
          is_read?: boolean
          is_resolved?: boolean
          project_id?: string | null
          resolved_at?: string | null
          source?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          alert_type?: string
          created_at?: string
          description?: string | null
          id?: string
          is_read?: boolean
          is_resolved?: boolean
          project_id?: string | null
          resolved_at?: string | null
          source?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "digital_footprint_alerts_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "digital_footprint_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      stripe_webhook_events: {
        Row: {
          processing_token: string | null
          lease_expires_at: string | null
          connected_account_id: string | null
          error_message: string | null
          event_id: string
          event_type: string
          id: string
          object_id: string | null
          processed_at: string | null
          received_at: string
          status: string
        }
        Insert: {
          processing_token?: string | null
          lease_expires_at?: string | null
          connected_account_id?: string | null
          error_message?: string | null
          event_id: string
          event_type: string
          id?: string
          object_id?: string | null
          processed_at?: string | null
          received_at?: string
          status?: string
        }
        Update: {
          processing_token?: string | null
          lease_expires_at?: string | null
          connected_account_id?: string | null
          error_message?: string | null
          event_id?: string
          event_type?: string
          id?: string
          object_id?: string | null
          processed_at?: string | null
          received_at?: string
          status?: string
        }
        Relationships: []
      }
    };
    Views: Record<never, never>;
    Functions: {
      record_stripe_invoice_payment: {
        Args: {
          p_amount_minor: number
          p_checkout_session_id: string
          p_currency: string
          p_event_id: string
          p_invoice_id: string
          p_paid_at: string
          p_payment_intent_id: string
        }
        Returns: Json
      }
      record_stripe_refund: {
        Args: {
          p_amount_minor: number
          p_currency: string
          p_event_id: string
          p_payment_intent_id: string
          p_reason: string
          p_refund_id: string
          p_refunded_at: string
        }
        Returns: Json
      }

      record_stripe_website_payment: {
        Args: { p_project_reference: string; p_amount_minor: number; p_currency: string; p_payment_intent_id: string; p_event_id: string; p_checkout_session_id: string; p_paid_at: string };
        Returns: Json;
      };
      record_stripe_website_refund: {
        Args: { p_payment_intent_id: string; p_refund_id: string; p_event_id: string; p_amount_minor: number; p_currency: string; p_refunded_at: string };
        Returns: Json;
      };
      record_stripe_milestone_payment: {
        Args: { p_milestone_id: string; p_amount_minor: number; p_currency: string; p_payment_intent_id: string; p_checkout_session_id: string; p_paid_at: string };
        Returns: undefined;
      };
      record_stripe_milestone_refund: {
        Args: { p_milestone_id: string; p_payment_intent_id: string; p_refunded_minor: number; p_currency: string };
        Returns: undefined;
      };
      claim_stripe_webhook: {
        Args: { p_event_id: string; p_event_type: string; p_object_id: string | null; p_connected_account_id: string | null; p_token: string };
        Returns: string;
      };
    };
    Enums: Record<never, never>;
    CompositeTypes: Record<never, never>;
  };
};
