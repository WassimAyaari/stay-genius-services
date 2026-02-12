

# Translate Auth Pages to English and Fix Card Shifting

## 1. Translate All French Text to English

### Files to update:

**LoginCard.tsx** - Subtitle text and tab labels
- "Connectez-vous pour acceder..." -> "Sign in to access hotel services"
- "Creez votre compte..." -> "Create your account to access hotel services"
- "Connexion" -> "Login", "Inscription" -> "Register"

**LoginForm.tsx** - Labels, validation, toasts, button
- "Adresse email invalide" -> "Invalid email address"
- "Le mot de passe est requis" -> "Password is required"
- "Mot de passe" -> "Password"
- "Se connecter" -> "Sign In"
- "Connexion en cours..." -> "Signing in..."
- All toast titles/descriptions to English

**BasicInfoFields.tsx** - Labels and placeholders
- "Prenom" -> "First Name", "Nom" -> "Last Name"

**DateFields.tsx** - Labels, placeholders, date locale
- "Date de naissance" -> "Date of Birth"
- "Date d'arrivee" -> "Check-in Date", "Date de depart" -> "Check-out Date"
- "Selectionner" -> "Select"
- Date formatting from 'fr-FR' to 'en-US'

**AdditionalFields.tsx** - Labels and placeholders
- "Nationalite" -> "Nationality"
- "Numero de chambre" -> "Room Number"

**PasswordField.tsx** - Labels and placeholders
- "Mot de passe" -> "Password"
- "Confirmer le mot de passe" -> "Confirm Password"

**CompanionsList.tsx** - Labels, relation options, button
- "Accompagnants" -> "Companions"
- Relation options: "Conjoint(e)" -> "Spouse", "Enfant" -> "Child", etc.
- "Ajouter un accompagnant" -> "Add a Companion"

**useRegistrationForm.ts** - Validation messages and toasts
- All Zod validation messages to English
- All toast messages to English

**BirthDatePicker.tsx** - Default placeholder and date locale
- "Selectionner une date" -> "Select a date"
- Date formatting from 'fr-FR' to 'en-US'

## 2. Fix Card Shifting on Input Focus

The card shifts when focusing inputs because the page content height changes (e.g., validation messages appearing, or mobile keyboard triggering scroll changes) while the card is vertically centered with `items-center`.

**Fix in Login.tsx**: Add `overflow-y: scroll` to the container so the scrollbar is always present, preventing layout shifts. Also ensure the card doesn't reposition by using a stable layout approach (e.g., `items-start` with top padding, or keeping `items-center` but forcing consistent scrollbar).

