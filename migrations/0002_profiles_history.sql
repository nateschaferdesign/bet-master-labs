create table if not exists profiles (
  user_id    text primary key,
  username   text not null unique,
  created_at timestamptz not null default now()
);

create table if not exists lookup_history (
  id         serial primary key,
  user_id    text not null,
  kind       text not null,
  title      text not null,
  href       text not null,
  subtitle   text,
  created_at timestamptz not null default now()
);

create index if not exists lookup_history_user_idx
  on lookup_history (user_id, created_at desc);

create unique index if not exists lookup_history_user_href_idx
  on lookup_history (user_id, href);
