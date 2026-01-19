/**
 * Zambia Property - Type Definitions
 * 
 * Centralized type definitions for the entire application.
 * Using strict TypeScript for type safety across all components.
 */

// ==============================
// USER & AUTH TYPES
// ==============================

export type UserRole = 'PUBLIC' | 'AGENT' | 'LANDLORD' | 'ADMIN';

export type UserStatus = 'ACTIVE' | 'INACTIVE' | 'PENDING' | 'SUSPENDED';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  avatarUrl?: string;
  role: UserRole;
  status: UserStatus;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface AgentProfile {
  id: string;
  userId: string;
  companyName?: string;
  licenseNumber?: string;
  bio?: string;
  specializations: PropertyType[];
  serviceAreas: string[];
  isVerified: boolean;
  verifiedAt?: Date;
  totalListings: number;
  totalSales: number;
  averageRating: number;
  totalReviews: number;
  whatsappNumber?: string;
  createdAt: Date;
  updatedAt: Date;
  user?: User;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: 'AGENT' | 'LANDLORD';
  companyName?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

// ==============================
// PROPERTY TYPES
// ==============================

export type PropertyType = 'HOUSE' | 'LAND' | 'LODGE' | 'COMMERCIAL';

export type PropertyStatus = 'DRAFT' | 'PENDING' | 'APPROVED' | 'REJECTED' | 'SOLD' | 'RENTED';

export type ListingType = 'SALE' | 'RENT';

export interface Property {
  id: string;
  title: string;
  slug: string;
  description: string;
  propertyType: PropertyType;
  listingType: ListingType;
  status: PropertyStatus;
  
  // Pricing
  price: number;
  currency: string;
  priceNegotiable: boolean;
  
  // Location
  address: string;
  city: string;
  province: string;
  latitude?: number;
  longitude?: number;
  
  // Details
  bedrooms?: number;
  bathrooms?: number;
  parkingSpaces?: number;
  floorArea?: number;
  landArea?: number;
  yearBuilt?: number;
  
  // Features
  features: Record<string, boolean>;
  amenities: Record<string, boolean>;
  
  // Media
  images: PropertyImage[];
  
  // Relations
  ownerId: string;
  owner?: User;
  agentId?: string;
  agent?: AgentProfile;
  
  // Stats
  viewCount: number;
  saveCount: number;
  inquiryCount: number;
  
  // Featured
  isFeatured: boolean;
  featuredUntil?: Date;
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
}

export interface PropertyImage {
  id: string;
  propertyId: string;
  url: string;
  thumbnailUrl?: string;
  altText?: string;
  isPrimary: boolean;
  sortOrder: number;
}

export interface PropertyFilters {
  propertyType?: PropertyType;
  listingType?: ListingType;
  city?: string;
  province?: string;
  minPrice?: number;
  maxPrice?: number;
  minBedrooms?: number;
  maxBedrooms?: number;
  minArea?: number;
  maxArea?: number;
  features?: string[];
  search?: string;
  sortBy?: 'newest' | 'price_asc' | 'price_desc' | 'popular';
}

export interface CreatePropertyData {
  title: string;
  description: string;
  propertyType: PropertyType;
  listingType: ListingType;
  price: number;
  currency?: string;
  priceNegotiable?: boolean;
  address: string;
  city: string;
  province: string;
  latitude?: number;
  longitude?: number;
  bedrooms?: number;
  bathrooms?: number;
  parkingSpaces?: number;
  floorArea?: number;
  landArea?: number;
  yearBuilt?: number;
  features?: Record<string, boolean>;
  amenities?: Record<string, boolean>;
}

// ==============================
// INQUIRY & MESSAGE TYPES
// ==============================

export type InquiryStatus = 'NEW' | 'READ' | 'REPLIED' | 'CLOSED';

export interface Inquiry {
  id: string;
  propertyId: string;
  property?: Property;
  senderId: string;
  sender?: User;
  receiverId: string;
  receiver?: User;
  message: string;
  status: InquiryStatus;
  createdAt: Date;
  updatedAt: Date;
  replies?: InquiryReply[];
}

export interface InquiryReply {
  id: string;
  inquiryId: string;
  senderId: string;
  sender?: User;
  message: string;
  createdAt: Date;
}

// ==============================
// ADMIN TYPES
// ==============================

export interface AdminStats {
  totalUsers: number;
  totalAgents: number;
  totalLandlords: number;
  totalProperties: number;
  pendingApprovals: number;
  totalInquiries: number;
  recentActivity: AuditLog[];
}

export interface AuditLog {
  id: string;
  userId: string;
  user?: User;
  action: string;
  entityType: string;
  entityId?: string;
  details?: Record<string, any>;
  ipAddress?: string;
  createdAt: Date;
}

export interface ApprovalRequest {
  id: string;
  type: 'USER' | 'PROPERTY';
  entityId: string;
  entity: User | Property;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  requestedAt: Date;
  reviewedAt?: Date;
  reviewedBy?: string;
  notes?: string;
}

// ==============================
// API TYPES
// ==============================

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: ApiError;
  pagination?: PaginationMeta;
}

export interface ApiError {
  message: string;
  code: string;
  statusCode: number;
  details?: any;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasMore: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationMeta;
}

// ==============================
// UI TYPES
// ==============================

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface NavItem {
  label: string;
  href: string;
  icon?: React.ReactNode;
  badge?: number;
  children?: NavItem[];
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

// ==============================
// FORM TYPES
// ==============================

export interface FormFieldError {
  field: string;
  message: string;
}

export interface FormState<T> {
  data: T;
  errors: FormFieldError[];
  isSubmitting: boolean;
  isValid: boolean;
}

// ==============================
// ANALYTICS TYPES
// ==============================

export interface PropertyAnalytics {
  propertyId: string;
  views: number;
  saves: number;
  inquiries: number;
  viewsByDay: { date: string; count: number }[];
  topReferrers: { source: string; count: number }[];
}

export interface DashboardStats {
  totalListings: number;
  activeListings: number;
  totalViews: number;
  totalInquiries: number;
  totalSaves: number;
  conversionRate: number;
  recentInquiries: Inquiry[];
  topProperties: Property[];
}

// ==============================
// LOCATION TYPES
// ==============================

export interface ZambiaProvince {
  name: string;
  capital: string;
  cities: string[];
}

// Mumbwa District Areas - Complete List of Villages and Areas
export const MUMBWA_AREAS = [
  // Main Town
  'Mumbwa Town',
  'Mumbwa Boma',
  'Mumbwa Township',
  
  // Major Villages & Areas
  'Nangoma',
  'Kaindu',
  'Kasip',
  'Muembe',
  'Shakumbila',
  'Myooye',
  'Banachewembwe',
  'Namukumbo',
  'Luiri',
  'Blue Lagoon',
  'Chulwe',
  'Landless Corner',
  'Nalubanda',
  'Kabulamwanda',
  'Chibombo',
  'Chisamba',
  
  // Chief Areas
  'Chief Mumba',
  'Chief Shakumbila',
  'Chief Mulendema',
  'Chief Kaindu',
  'Chief Nalubanda',
  'Chief Chibuluma',
  'Chief Moono',
  'Chief Mwanza',
  
  // Farming Areas
  'Nangoma Farming Block',
  'Mumbwa Farming Block',
  'Kaindu Farming Area',
  'Myooye Farming Block',
  'Kasip Farm Area',
  'Muembe Agricultural Area',
  
  // Road/Highway Areas
  'M9 Highway',
  'M20 Road',
  'Great West Road',
  'Mumbwa-Namwala Road',
  'Mumbwa-Landless Road',
  
  // Wildlife/Tourist Areas
  'Blue Lagoon National Park',
  'Kafue River Area',
  'Kafue Flats',
  'Lochinvar Area',
  
  // Settlements & Compounds
  'Shikabeta',
  'Ipumbu',
  'Namaila',
  'Nakanyika',
  'Chilala',
  'Chibwe',
  'Kayoyo',
  'Mwembeshi',
  'Kapyanga',
  'Nalusanga',
  'Chinyunyu',
  'Mukobela',
  'Mwanachingwala',
  'Shimukuni',
  'Namoomba',
  'Chikobo',
  'Katunda',
  'Nambala',
  'Choma',
  'Makunku',
  'Chitongo',
  'Nkole',
  'Chipese',
  'Kabulwebulwe',
  'Choongo',
  'Mungaila',
  
  // Other
  'Other (Specify in Address)',
] as const;

// Mumbwa District Zones for easier categorization
export const MUMBWA_ZONES = {
  'Mumbwa Town & Centre': [
    'Mumbwa Town',
    'Mumbwa Boma',
    'Mumbwa Township',
    'Landless Corner',
  ],
  'Northern Zone': [
    'Nangoma',
    'Myooye',
    'Kasip',
    'Banachewembwe',
    'Blue Lagoon',
    'Kafue Flats',
  ],
  'Southern Zone': [
    'Kaindu',
    'Shakumbila',
    'Nalubanda',
    'Kabulamwanda',
  ],
  'Eastern Zone': [
    'Muembe',
    'Chulwe',
    'Luiri',
    'Namukumbo',
    'Chibombo',
    'Chisamba',
  ],
  'Western Zone': [
    'Chief Mumba',
    'Chief Mulendema',
    'Mwembeshi',
    'Kafue River Area',
  ],
  'Farming Blocks': [
    'Nangoma Farming Block',
    'Mumbwa Farming Block',
    'Kaindu Farming Area',
    'Myooye Farming Block',
    'Kasip Farm Area',
    'Muembe Agricultural Area',
  ],
};

export const ZAMBIA_PROVINCES: ZambiaProvince[] = [
  { 
    name: 'Central', 
    capital: 'Kabwe', 
    cities: [
      'Mumbwa Town', 'Mumbwa Boma', 'Mumbwa Township', 'Landless Corner',
      'Nangoma', 'Kaindu', 'Kasip', 'Muembe', 'Shakumbila', 'Myooye', 
      'Banachewembwe', 'Namukumbo', 'Luiri', 'Blue Lagoon', 'Chulwe',
      'Nalubanda', 'Kabulamwanda', 'Chibombo', 'Chisamba',
      'Chief Mumba', 'Chief Shakumbila', 'Chief Mulendema', 'Chief Kaindu',
      'Nangoma Farming Block', 'Mumbwa Farming Block', 'Kafue River Area',
      'Shikabeta', 'Ipumbu', 'Namaila', 'Nakanyika', 'Chilala', 'Chibwe',
      'Kayoyo', 'Mwembeshi', 'Kapyanga', 'Nalusanga', 'Chinyunyu',
    ] 
  },
  { name: 'Lusaka', capital: 'Lusaka', cities: ['Lusaka', 'Chilanga', 'Kafue', 'Chongwe', 'Luangwa'] },
  { name: 'Copperbelt', capital: 'Ndola', cities: ['Ndola', 'Kitwe', 'Chingola', 'Mufulira', 'Luanshya'] },
  { name: 'Southern', capital: 'Livingstone', cities: ['Livingstone', 'Choma', 'Mazabuka', 'Monze', 'Kalomo'] },
  { name: 'Eastern', capital: 'Chipata', cities: ['Chipata', 'Petauke', 'Katete', 'Lundazi', 'Mambwe'] },
  { name: 'Northern', capital: 'Kasama', cities: ['Kasama', 'Mbala', 'Mpulungu', 'Luwingu', 'Mporokoso'] },
  { name: 'Luapula', capital: 'Mansa', cities: ['Mansa', 'Samfya', 'Nchelenge', 'Kawambwa', 'Mwense'] },
  { name: 'North-Western', capital: 'Solwezi', cities: ['Solwezi', 'Kasempa', 'Mwinilunga', 'Zambezi', 'Kabompo'] },
  { name: 'Western', capital: 'Mongu', cities: ['Mongu', 'Senanga', 'Kaoma', 'Sesheke', 'Kalabo'] },
  { name: 'Muchinga', capital: 'Chinsali', cities: ['Chinsali', 'Mpika', 'Nakonde', 'Isoka', 'Chama'] },
];

// ==============================
// PROPERTY FEATURES
// ==============================

export const PROPERTY_FEATURES = [
  'Swimming Pool',
  'Garden',
  'Garage',
  'Security',
  'Borehole',
  'Solar Power',
  'Generator',
  'Air Conditioning',
  'Furnished',
  'Gated Community',
  'Staff Quarters',
  'Balcony',
  'Gym',
  'Tennis Court',
  'CCTV',
  'Electric Fence',
  'Backup Power',
  'Water Tank',
] as const;

export const PROPERTY_AMENITIES = [
  'WiFi',
  'Cable TV',
  'Kitchen',
  'Laundry',
  'Parking',
  'Pet Friendly',
  'Wheelchair Access',
  'Elevator',
  'Fire Alarm',
  'Intercom',
] as const;

// ==============================
// UTILITY TYPES
// ==============================

export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};
