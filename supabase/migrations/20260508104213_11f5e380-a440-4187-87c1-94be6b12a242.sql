-- Cards table
create table public.cards (
  id uuid primary key default gen_random_uuid(),
  short_id text not null unique,
  data jsonb not null,
  created_at timestamptz not null default now()
);

create index cards_short_id_idx on public.cards(short_id);

alter table public.cards enable row level security;

-- Anyone can read any card (cards are meant to be shared via link)
create policy "Anyone can view cards"
  on public.cards for select
  using (true);

-- Anyone can create a new card
create policy "Anyone can create cards"
  on public.cards for insert
  with check (true);

-- No update / delete policies — cards are immutable once created.

-- Storage bucket for hero photos
insert into storage.buckets (id, name, public)
values ('card-photos', 'card-photos', true)
on conflict (id) do nothing;

-- Anyone can upload to card-photos
create policy "Anyone can upload card photos"
  on storage.objects for insert
  with check (bucket_id = 'card-photos');

-- Anyone can view card photos (public bucket)
create policy "Card photos are publicly viewable"
  on storage.objects for select
  using (bucket_id = 'card-photos');