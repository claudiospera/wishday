// ============================================================
// Tipi TypeScript per il database Supabase di CelebApp
// ============================================================

export type UserPlan = 'free' | 'premium'
export type EventType = 'birthday' | 'wedding' | 'graduation' | 'baptism' | 'other'
export type WishItemType = 'single' | 'collective'
export type WishItemStatus = 'available' | 'partially_funded' | 'fully_funded' | 'purchased' | 'reserved'
export type ContributionStatus = 'pending' | 'completed' | 'refunded'
export type PayoutStatus = 'pending' | 'completed' | 'failed'
export type SubscriptionStatus = 'active' | 'cancelled' | 'past_due'

export interface User {
  id: string
  full_name: string | null
  email: string
  avatar_url: string | null
  stripe_account_id: string | null
  stripe_account_verified: boolean
  plan: UserPlan
  created_at: string
}

export interface Event {
  id: string
  user_id: string
  title: string
  type: EventType
  date: string
  description: string | null
  cover_image_url: string | null
  slug: string
  iban: string | null
  bank_owner_name: string | null
  is_public: boolean
  created_at: string
}

export interface WishItem {
  id: string
  event_id: string
  title: string
  description: string | null
  price: number
  image_url: string | null
  shop_name: string | null
  shop_url: string | null
  type: WishItemType
  status: WishItemStatus
  reserved_by_name: string | null
  reserved_by_email: string | null
  collected_amount: number
  contributors_count: number
  suggested_contribution: number | null
  sort_order: number
  created_at: string
}

export interface Contribution {
  id: string
  wish_item_id: string
  contributor_name: string
  contributor_email: string
  amount: number
  message: string | null
  stripe_payment_intent_id: string | null
  status: ContributionStatus
  created_at: string
}

export interface Payout {
  id: string
  user_id: string
  event_id: string
  wish_item_id: string | null
  amount: number
  stripe_payout_id: string | null
  status: PayoutStatus
  note: string | null
  created_at: string
}

export interface Message {
  id: string
  event_id: string
  sender_name: string
  sender_email: string | null
  content: string
  is_public: boolean
  created_at: string
}

export interface Subscription {
  id: string
  user_id: string
  stripe_subscription_id: string
  plan: UserPlan
  status: SubscriptionStatus
  current_period_end: string
  created_at: string
}

// Tipi estesi per join
export interface EventWithUser extends Event {
  users: User
}

export interface WishItemWithContributions extends WishItem {
  contributions?: Contribution[]
}

export interface EventWithItems extends Event {
  wish_items: WishItem[]
  messages?: Message[]
}
