# MVP Checklist - Local Storage Implementation

This checklist outlines what needs to be completed for a functional MVP using **localStorage** instead of a database. This allows the app to work fully without backend infrastructure.

## 🎯 Core MVP Features

### 1. Local Storage Service
- [ ] Create `lib/storage.ts` utility
  - [ ] `getProposals()` - Retrieve all proposals from localStorage
  - [ ] `saveProposal(proposal)` - Save/update proposal to localStorage
  - [ ] `deleteProposal(id)` - Remove proposal from localStorage
  - [ ] `getTemplates()` - Retrieve templates from localStorage
  - [ ] `saveTemplate(template)` - Save template to localStorage
  - [ ] `getUserSettings()` - Get user preferences/branding
  - [ ] `saveUserSettings(settings)` - Save user preferences
  - [ ] Handle localStorage errors (quota exceeded, etc.)
  - [ ] Migration/versioning for data structure changes

### 2. Authentication (Simplified)
- [ ] Create `lib/auth-storage.ts`
  - [ ] `registerUser(email, password, name)` - Store user in localStorage
  - [ ] `loginUser(email, password)` - Verify and set current user
  - [ ] `logoutUser()` - Clear current session
  - [ ] `getCurrentUser()` - Get logged-in user
  - [ ] `isAuthenticated()` - Check if user is logged in
  - [ ] Password hashing (use simple hash or bcryptjs)
  - [ ] Session management (store current user ID)

### 3. Proposal Management
- [ ] Update `hooks/useProposal.ts`
  - [ ] Load proposal from localStorage on mount
  - [ ] Auto-save to localStorage on changes
  - [ ] Handle proposal creation
  - [ ] Handle proposal updates
  - [ ] Handle proposal deletion
  - [ ] Generate unique IDs for new proposals

- [ ] Update `app/(dashboard)/proposals/page.tsx`
  - [ ] Load proposals from localStorage
  - [ ] Display all user's proposals
  - [ ] Implement search functionality (filter in-memory)
  - [ ] Handle empty state (no proposals)

- [ ] Update `app/(dashboard)/proposals/[id]/page.tsx`
  - [ ] Load proposal by ID from localStorage
  - [ ] Handle not found (invalid ID)
  - [ ] Save changes to localStorage
  - [ ] Show loading state while loading

- [ ] Update `app/(dashboard)/proposals/new/page.tsx`
  - [ ] Create new proposal in localStorage
  - [ ] Initialize from template if provided
  - [ ] Redirect to edit page after creation

### 4. Template System
- [ ] Create default templates in `lib/default-templates.ts`
  - [ ] General Business Proposal template
  - [ ] Consulting Services template
  - [ ] Design Services template
  - [ ] Development Proposal template
  - [ ] Marketing Campaign template
  - [ ] Client Proposal template (new category)
  - [ ] Each template with proper sections

- [ ] Update `app/(dashboard)/templates/page.tsx`
  - [ ] Load templates from localStorage (or use defaults)
  - [ ] Implement search filtering
  - [ ] Implement category filtering
  - [ ] Handle template selection

- [ ] Initialize templates on first load
  - [ ] Check if templates exist in localStorage
  - [ ] If not, populate with default templates
  - [ ] Run on app initialization

### 5. Proposal Builder Enhancements
- [ ] Section Type Selector Modal
  - [ ] Create `components/proposals/SectionTypeModal.tsx`
  - [ ] Display all available section types
  - [ ] Allow selection of section type
  - [ ] Integrate with ProposalBuilder "Add Section" button

- [ ] Preview Integration
  - [ ] Connect PreviewPanel to ProposalBuilder
  - [ ] Show preview in modal or side panel
  - [ ] Real-time preview updates as user edits
  - [ ] Toggle preview on/off

- [ ] Section Management
  - [ ] Drag & drop reordering (optional for MVP)
  - [ ] Section deletion confirmation
  - [ ] Section duplication
  - [ ] Auto-save on section changes

### 6. Branding & User Settings
- [ ] Update `components/proposals/BrandingSettings.tsx`
  - [ ] Save branding to localStorage (user settings)
  - [ ] Load branding on component mount
  - [ ] Apply branding to proposals
  - [ ] Handle logo as base64 in localStorage
  - [ ] Validate color inputs

- [ ] Create Settings Page (`app/(dashboard)/settings/page.tsx`)
  - [ ] Display branding settings
  - [ ] User profile information
  - [ ] Save all settings to localStorage

### 7. Dashboard Functionality
- [ ] Update `app/(dashboard)/dashboard/page.tsx`
  - [ ] Load real proposals from localStorage
  - [ ] Calculate stats (total, drafts, sent)
  - [ ] Show recent proposals (sorted by updatedAt)
  - [ ] Handle empty state

### 8. PDF Export
- [ ] Implement basic PDF export
  - [ ] Install PDF library (jsPDF + html2canvas OR react-pdf)
  - [ ] Update `lib/pdf-export.ts`
  - [ ] Generate PDF from proposal HTML
  - [ ] Apply branding to PDF
  - [ ] Trigger download
  - [ ] Add export button to ProposalBuilder

### 9. Search & Filtering
- [ ] Proposal Search
  - [ ] Implement search in `app/(dashboard)/proposals/page.tsx`
  - [ ] Filter by title, content, status
  - [ ] Real-time search as user types

- [ ] Template Search
  - [ ] Already has UI, implement actual filtering
  - [ ] Search by name, description, category

### 10. Data Persistence & Migration
- [ ] Create data versioning system
  - [ ] Store version number in localStorage
  - [ ] Migration functions for data structure changes
  - [ ] Handle data corruption gracefully

- [ ] Export/Import functionality (optional for MVP)
  - [ ] Export all proposals as JSON
  - [ ] Import proposals from JSON
  - [ ] Backup/restore functionality

## 🎨 UI/UX Improvements

### 11. Loading States
- [ ] Add loading spinners for async operations
- [ ] Skeleton loaders for proposal lists
- [ ] Loading state for PDF generation

### 12. Error Handling
- [ ] Error boundaries for React errors
- [ ] Toast notifications for errors
- [ ] Handle localStorage quota exceeded
- [ ] Handle invalid data gracefully

### 13. User Feedback
- [ ] Success messages (toasts)
- [ ] Confirmation dialogs for destructive actions
- [ ] Auto-save indicators
- [ ] "Unsaved changes" warnings

### 14. Empty States
- [ ] Empty state for no proposals
- [ ] Empty state for no templates
- [ ] Empty state for search results
- [ ] Helpful CTAs in empty states

## 🔧 Technical Implementation

### 15. Code Organization
- [ ] Create `lib/storage/` directory
  - [ ] `proposals.ts` - Proposal storage functions
  - [ ] `templates.ts` - Template storage functions
  - [ ] `auth.ts` - Authentication storage
  - [ ] `settings.ts` - User settings storage
  - [ ] `utils.ts` - Storage utilities

- [ ] Create `lib/hooks/` for custom hooks
  - [ ] `useLocalStorage.ts` - Generic localStorage hook
  - [ ] `useProposals.ts` - Proposals management hook
  - [ ] `useTemplates.ts` - Templates management hook

### 16. Type Safety
- [ ] Ensure all localStorage operations are type-safe
- [ ] Create storage schema types
- [ ] Validate data on read from localStorage
- [ ] Type guards for data validation

### 17. Performance
- [ ] Debounce auto-save operations
- [ ] Optimize re-renders in ProposalBuilder
- [ ] Lazy load heavy components
- [ ] Memoize expensive computations

## 📋 Testing & Validation

### 18. Manual Testing Checklist
- [ ] Create new proposal
- [ ] Edit existing proposal
- [ ] Delete proposal
- [ ] Search proposals
- [ ] Filter templates
- [ ] Select template and create proposal
- [ ] Save branding settings
- [ ] Export PDF
- [ ] Login/logout
- [ ] Register new user
- [ ] Data persists on page refresh
- [ ] Multiple browser tabs sync (if possible)

### 19. Edge Cases
- [ ] Handle localStorage disabled
- [ ] Handle localStorage full
- [ ] Handle corrupted data
- [ ] Handle invalid proposal IDs
- [ ] Handle missing templates
- [ ] Handle very long proposal content

## 🚀 MVP Launch Readiness

### 20. Final Polish
- [ ] Remove all console.log statements
- [ ] Remove all TODO comments (or document them)
- [ ] Add helpful error messages
- [ ] Add user onboarding (optional)
- [ ] Test on different browsers
- [ ] Test on mobile devices
- [ ] Performance audit
- [ ] Accessibility check

## 📊 Data Structure

### localStorage Keys:
```
- `outvoice:proposals` - Array of proposals
- `outvoice:templates` - Array of templates
- `outvoice:users` - Array of users
- `outvoice:currentUser` - Current logged-in user ID
- `outvoice:settings` - User settings/branding
- `outvoice:version` - Data version for migrations
```

### Proposal Structure:
```typescript
{
  id: string;
  userId: string;
  title: string;
  templateId?: string;
  sections: ProposalSection[];
  branding?: BrandingSettings;
  status: "draft" | "sent" | "accepted" | "rejected";
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}
```

### User Structure:
```typescript
{
  id: string;
  email: string;
  name?: string;
  passwordHash: string; // Hashed password
  createdAt: string;
  updatedAt: string;
}
```

## 🎯 Priority Order

### Phase 1: Core Functionality (Must Have)
1. Local Storage Service
2. Proposal Management (CRUD)
3. Template System
4. Section Type Selector
5. Preview Integration

### Phase 2: Essential Features (Should Have)
6. Authentication
7. Branding Settings
8. Dashboard with Real Data
9. Search Functionality

### Phase 3: Nice to Have (Could Have)
10. PDF Export
11. Settings Page
12. Export/Import
13. Advanced Features

## 📝 Notes

- **localStorage Limitations**: ~5-10MB per domain
- **No Multi-Device Sync**: Data is browser-specific
- **No Collaboration**: Single user per browser
- **Data Loss Risk**: Clearing browser data removes all data
- **Consider**: Add export/import for backup functionality

## 🔄 Future Migration Path

When ready to move to a database:
1. Create API endpoints matching localStorage functions
2. Add migration script to upload localStorage data
3. Update hooks to use API instead of localStorage
4. Keep localStorage as fallback/cache

