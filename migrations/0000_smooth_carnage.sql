CREATE TABLE "blog_posts" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"content" text NOT NULL,
	"excerpt" text,
	"image_url" text,
	"category" text NOT NULL,
	"publish_date" timestamp DEFAULT now(),
	"author" text DEFAULT 'Admin',
	"featured" boolean DEFAULT false
);
--> statement-breakpoint
CREATE TABLE "bookings" (
	"id" serial PRIMARY KEY NOT NULL,
	"tour_id" integer NOT NULL,
	"full_name" text NOT NULL,
	"email" text NOT NULL,
	"phone" text NOT NULL,
	"start_date" text NOT NULL,
	"persons" integer NOT NULL,
	"total_price" integer NOT NULL,
	"status" text DEFAULT 'pending',
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "categories" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"image_url" text
);
--> statement-breakpoint
CREATE TABLE "custom_requests" (
	"id" serial PRIMARY KEY NOT NULL,
	"full_name" text NOT NULL,
	"email" text NOT NULL,
	"destination" text NOT NULL,
	"budget" text NOT NULL,
	"departure_date" text NOT NULL,
	"persons" integer NOT NULL,
	"interests" text,
	"additional_details" text,
	"status" text DEFAULT 'new',
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "newsletters" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "newsletters_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "orders" (
	"id" serial PRIMARY KEY NOT NULL,
	"customer_name" text NOT NULL,
	"email" text NOT NULL,
	"phone" text NOT NULL,
	"address" text NOT NULL,
	"city" text NOT NULL,
	"zip_code" text,
	"items" jsonb NOT NULL,
	"total_amount" integer NOT NULL,
	"status" text DEFAULT 'pending',
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "products" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"price" integer NOT NULL,
	"discount_price" integer,
	"image_url" text,
	"category" text NOT NULL,
	"is_new" boolean DEFAULT false,
	"in_stock" boolean DEFAULT true
);
--> statement-breakpoint
CREATE TABLE "testimonials" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"country" text NOT NULL,
	"avatar" text,
	"rating" integer NOT NULL,
	"comment" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tours" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"short_description" text,
	"image_url" text,
	"duration" integer NOT NULL,
	"price" integer NOT NULL,
	"discount_price" integer,
	"locations" text NOT NULL,
	"featured" boolean DEFAULT false,
	"category_id" integer,
	"rating" double precision DEFAULT 0,
	"review_count" integer DEFAULT 0,
	"tour_plan" jsonb,
	"map_points" jsonb
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"username" text NOT NULL,
	"password" text NOT NULL,
	"email" text NOT NULL,
	"is_admin" boolean DEFAULT false,
	CONSTRAINT "users_username_unique" UNIQUE("username")
);
