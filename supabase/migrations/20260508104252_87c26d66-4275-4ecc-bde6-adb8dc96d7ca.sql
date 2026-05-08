-- Limit card payload size (~200KB JSON) to prevent abuse on public-insert table
alter table public.cards
  add constraint cards_data_size_check
  check (octet_length(data::text) < 200000);

alter table public.cards
  add constraint cards_short_id_format check (short_id ~ '^[a-zA-Z0-9_-]{6,32}$');

-- Storage: drop the broad SELECT policy that lets clients LIST files.
-- The bucket is public, so direct file URLs still work without an RLS SELECT policy.
drop policy if exists "Card photos are publicly viewable" on storage.objects;

-- Restrict uploads: allow uploads into the card-photos bucket and enforce size/type through bucket settings
drop policy if exists "Anyone can upload card photos" on storage.objects;
create policy "Anyone can upload card photos"
  on storage.objects for insert
  with check (
    bucket_id = 'card-photos'
  );

-- Set bucket file size limit (5MB) and allowed MIME types
update storage.buckets
set file_size_limit = 5242880,
    allowed_mime_types = array['image/jpeg','image/png','image/webp','image/gif']
where id = 'card-photos';