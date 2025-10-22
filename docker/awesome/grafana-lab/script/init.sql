CREATE TYPE "public"."taskstatus" AS ENUM (
  'PENDING',
  'RUNNING',
  'SUCCESS',
  'FAILED',
  'RAG_PROCESS_FAILED',
  'RAG_PROCESSED'
);
CREATE SEQUENCE task_id_seq START 1;
CREATE TABLE "public"."task" (
  "id" int4 NOT NULL DEFAULT nextval('task_id_seq'::regclass),
  "host" varchar NOT NULL,
  "url" varchar NOT NULL,
  "status" "public"."taskstatus",
  "created_at" timestamp,
  "started_at" timestamp,
  "finished_at" timestamp
);
BEGIN;
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'www.ebay.com',
    'https://www.ebay.com/item/20087',
    'SUCCESS',
    '2025-10-03 05:04:24',
    '2025-10-03 05:04:29',
    '2025-10-03 05:06:18'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'www.amazon.com',
    'https://www.amazon.com/item/21083',
    'RAG_PROCESSED',
    '2025-10-03 03:53:18',
    '2025-10-03 03:53:20',
    '2025-10-03 03:54:11'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'buy.yahoo.com',
    'https://buy.yahoo.com/item/61456',
    'SUCCESS',
    '2025-10-03 04:58:21',
    '2025-10-03 04:58:25',
    '2025-10-03 04:59:24'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'www.ebay.com',
    'https://www.ebay.com/item/91176',
    'SUCCESS',
    '2025-10-03 05:31:51',
    '2025-10-03 05:31:52',
    '2025-10-03 05:33:26'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'buy.yahoo.com',
    'https://buy.yahoo.com/item/60310',
    'SUCCESS',
    '2025-10-03 09:00:30',
    '2025-10-03 09:00:31',
    '2025-10-03 09:01:29'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'www.ebay.com',
    'https://www.ebay.com/item/43083',
    'SUCCESS',
    '2025-10-03 06:45:41',
    '2025-10-03 06:45:41',
    '2025-10-03 06:46:59'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'buy.yahoo.com',
    'https://buy.yahoo.com/item/80585',
    'SUCCESS',
    '2025-10-03 03:24:47',
    '2025-10-03 03:24:49',
    '2025-10-03 03:26:02'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'www.amazon.com',
    'https://www.amazon.com/item/60522',
    'SUCCESS',
    '2025-10-03 03:15:11',
    '2025-10-03 03:15:13',
    '2025-10-03 03:16:42'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'www.ebay.com',
    'https://www.ebay.com/item/24847',
    'RAG_PROCESSED',
    '2025-10-03 08:04:44',
    '2025-10-03 08:04:48',
    '2025-10-03 08:06:06'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'www.ebay.com',
    'https://www.ebay.com/item/45680',
    'RAG_PROCESSED',
    '2025-10-03 10:26:13',
    '2025-10-03 10:26:16',
    '2025-10-03 10:26:38'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'www.amazon.com',
    'https://www.amazon.com/item/24256',
    'SUCCESS',
    '2025-10-03 04:36:19',
    '2025-10-03 04:36:20',
    '2025-10-03 04:37:33'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'www.amazon.com',
    'https://www.amazon.com/item/67177',
    'RUNNING',
    '2025-10-03 10:35:21',
    '2025-10-03 10:35:23',
    NULL
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'www.amazon.com',
    'https://www.amazon.com/item/89187',
    'SUCCESS',
    '2025-10-03 05:15:25',
    '2025-10-03 05:15:25',
    '2025-10-03 05:16:10'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'www.amazon.com',
    'https://www.amazon.com/item/82104',
    'SUCCESS',
    '2025-10-03 08:44:51',
    '2025-10-03 08:44:52',
    '2025-10-03 08:45:22'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'www.amazon.com',
    'https://www.amazon.com/item/44438',
    'SUCCESS',
    '2025-10-03 07:47:21',
    '2025-10-03 07:47:22',
    '2025-10-03 07:48:02'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'buy.yahoo.com',
    'https://buy.yahoo.com/item/26856',
    'SUCCESS',
    '2025-10-03 07:25:53',
    '2025-10-03 07:25:54',
    '2025-10-03 07:27:35'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'www.amazon.com',
    'https://www.amazon.com/item/93904',
    'SUCCESS',
    '2025-10-03 08:24:00',
    '2025-10-03 08:24:01',
    '2025-10-03 08:24:40'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'www.amazon.com',
    'https://www.amazon.com/item/75999',
    'RAG_PROCESSED',
    '2025-10-03 04:01:11',
    '2025-10-03 04:01:13',
    '2025-10-03 04:03:06'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'www.ebay.com',
    'https://www.ebay.com/item/89850',
    'RAG_PROCESSED',
    '2025-10-03 07:40:18',
    '2025-10-03 07:40:22',
    '2025-10-03 07:42:01'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'www.amazon.com',
    'https://www.amazon.com/item/59334',
    'SUCCESS',
    '2025-10-03 10:58:53',
    '2025-10-03 10:58:53',
    '2025-10-03 10:59:25'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'buy.yahoo.com',
    'https://buy.yahoo.com/item/17806',
    'RAG_PROCESS_FAILED',
    '2025-10-03 05:19:33',
    '2025-10-03 05:19:33',
    '2025-10-03 05:20:40'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'www.ebay.com',
    'https://www.ebay.com/item/33674',
    'FAILED',
    '2025-10-03 04:18:32',
    '2025-10-03 04:18:33',
    '2025-10-03 04:20:08'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'www.amazon.com',
    'https://www.amazon.com/item/64264',
    'SUCCESS',
    '2025-10-03 05:15:37',
    '2025-10-03 05:15:42',
    '2025-10-03 05:17:02'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'www.amazon.com',
    'https://www.amazon.com/item/33825',
    'SUCCESS',
    '2025-10-03 07:07:13',
    '2025-10-03 07:07:17',
    '2025-10-03 07:07:45'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'www.ebay.com',
    'https://www.ebay.com/item/95830',
    'SUCCESS',
    '2025-10-03 08:25:51',
    '2025-10-03 08:25:53',
    '2025-10-03 08:26:30'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'buy.yahoo.com',
    'https://buy.yahoo.com/item/34240',
    'SUCCESS',
    '2025-10-03 04:01:06',
    '2025-10-03 04:01:09',
    '2025-10-03 04:01:42'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'buy.yahoo.com',
    'https://buy.yahoo.com/item/80610',
    'SUCCESS',
    '2025-10-03 05:09:55',
    '2025-10-03 05:09:55',
    '2025-10-03 05:11:02'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'www.ebay.com',
    'https://www.ebay.com/item/76300',
    'SUCCESS',
    '2025-10-03 05:50:40',
    '2025-10-03 05:50:42',
    '2025-10-03 05:51:08'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'www.amazon.com',
    'https://www.amazon.com/item/20375',
    'SUCCESS',
    '2025-10-03 10:15:29',
    '2025-10-03 10:15:30',
    '2025-10-03 10:16:13'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'www.amazon.com',
    'https://www.amazon.com/item/92243',
    'RAG_PROCESSED',
    '2025-10-03 03:43:53',
    '2025-10-03 03:43:53',
    '2025-10-03 03:44:56'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'www.amazon.com',
    'https://www.amazon.com/item/81905',
    'SUCCESS',
    '2025-10-03 08:38:59',
    '2025-10-03 08:39:02',
    '2025-10-03 08:40:40'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'buy.yahoo.com',
    'https://buy.yahoo.com/item/65039',
    'RAG_PROCESSED',
    '2025-10-03 05:50:52',
    '2025-10-03 05:50:56',
    '2025-10-03 05:51:49'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'www.ebay.com',
    'https://www.ebay.com/item/91869',
    'RAG_PROCESSED',
    '2025-10-03 03:45:14',
    '2025-10-03 03:45:17',
    '2025-10-03 03:45:54'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'buy.yahoo.com',
    'https://buy.yahoo.com/item/89861',
    'RAG_PROCESSED',
    '2025-10-03 06:57:52',
    '2025-10-03 06:57:56',
    '2025-10-03 06:59:19'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'www.amazon.com',
    'https://www.amazon.com/item/14666',
    'RAG_PROCESSED',
    '2025-10-03 04:18:23',
    '2025-10-03 04:18:28',
    '2025-10-03 04:19:01'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'www.amazon.com',
    'https://www.amazon.com/item/24966',
    'SUCCESS',
    '2025-10-03 09:25:03',
    '2025-10-03 09:25:06',
    '2025-10-03 09:25:54'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'buy.yahoo.com',
    'https://buy.yahoo.com/item/44091',
    'RAG_PROCESSED',
    '2025-10-03 10:18:17',
    '2025-10-03 10:18:21',
    '2025-10-03 10:19:44'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'www.ebay.com',
    'https://www.ebay.com/item/95712',
    'SUCCESS',
    '2025-10-03 09:42:07',
    '2025-10-03 09:42:07',
    '2025-10-03 09:43:35'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'www.amazon.com',
    'https://www.amazon.com/item/76059',
    'SUCCESS',
    '2025-10-03 06:49:33',
    '2025-10-03 06:49:37',
    '2025-10-03 06:50:56'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'buy.yahoo.com',
    'https://buy.yahoo.com/item/97795',
    'SUCCESS',
    '2025-10-03 07:52:28',
    '2025-10-03 07:52:32',
    '2025-10-03 07:54:18'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'buy.yahoo.com',
    'https://buy.yahoo.com/item/29354',
    'PENDING',
    '2025-10-03 03:19:32',
    NULL,
    NULL
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'buy.yahoo.com',
    'https://buy.yahoo.com/item/45585',
    'SUCCESS',
    '2025-10-03 06:00:38',
    '2025-10-03 06:00:42',
    '2025-10-03 06:01:45'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'www.amazon.com',
    'https://www.amazon.com/item/92347',
    'RAG_PROCESSED',
    '2025-10-03 10:34:43',
    '2025-10-03 10:34:47',
    '2025-10-03 10:36:03'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'www.ebay.com',
    'https://www.ebay.com/item/38161',
    'RAG_PROCESSED',
    '2025-10-03 10:42:03',
    '2025-10-03 10:42:05',
    '2025-10-03 10:42:46'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'www.ebay.com',
    'https://www.ebay.com/item/43834',
    'RAG_PROCESSED',
    '2025-10-03 04:26:07',
    '2025-10-03 04:26:07',
    '2025-10-03 04:26:30'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'www.amazon.com',
    'https://www.amazon.com/item/76749',
    'SUCCESS',
    '2025-10-03 07:17:55',
    '2025-10-03 07:17:57',
    '2025-10-03 07:19:52'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'www.amazon.com',
    'https://www.amazon.com/item/96454',
    'RAG_PROCESS_FAILED',
    '2025-10-03 06:39:21',
    '2025-10-03 06:39:22',
    '2025-10-03 06:40:15'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'buy.yahoo.com',
    'https://buy.yahoo.com/item/15906',
    'RAG_PROCESSED',
    '2025-10-03 09:09:51',
    '2025-10-03 09:09:55',
    '2025-10-03 09:11:38'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'buy.yahoo.com',
    'https://buy.yahoo.com/item/72941',
    'SUCCESS',
    '2025-10-03 06:05:51',
    '2025-10-03 06:05:51',
    '2025-10-03 06:06:26'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'www.amazon.com',
    'https://www.amazon.com/item/57866',
    'FAILED',
    '2025-10-03 10:30:11',
    '2025-10-03 10:30:14',
    '2025-10-03 10:30:43'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'www.amazon.com',
    'https://www.amazon.com/item/71188',
    'SUCCESS',
    '2025-10-03 09:50:56',
    '2025-10-03 09:51:01',
    '2025-10-03 09:52:48'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'buy.yahoo.com',
    'https://buy.yahoo.com/item/56363',
    'SUCCESS',
    '2025-10-03 04:06:00',
    '2025-10-03 04:06:00',
    '2025-10-03 04:07:29'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'buy.yahoo.com',
    'https://buy.yahoo.com/item/75585',
    'RAG_PROCESS_FAILED',
    '2025-10-03 09:44:27',
    '2025-10-03 09:44:29',
    '2025-10-03 09:45:39'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'www.amazon.com',
    'https://www.amazon.com/item/96897',
    'SUCCESS',
    '2025-10-03 10:30:03',
    '2025-10-03 10:30:07',
    '2025-10-03 10:31:11'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'buy.yahoo.com',
    'https://buy.yahoo.com/item/78960',
    'RAG_PROCESSED',
    '2025-10-03 09:33:16',
    '2025-10-03 09:33:19',
    '2025-10-03 09:33:41'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'www.ebay.com',
    'https://www.ebay.com/item/40188',
    'RAG_PROCESSED',
    '2025-10-03 05:04:26',
    '2025-10-03 05:04:29',
    '2025-10-03 05:05:47'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'www.ebay.com',
    'https://www.ebay.com/item/91534',
    'RAG_PROCESSED',
    '2025-10-03 06:05:12',
    '2025-10-03 06:05:17',
    '2025-10-03 06:06:39'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'www.amazon.com',
    'https://www.amazon.com/item/50773',
    'RAG_PROCESSED',
    '2025-10-03 10:32:14',
    '2025-10-03 10:32:19',
    '2025-10-03 10:32:43'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'www.ebay.com',
    'https://www.ebay.com/item/33466',
    'SUCCESS',
    '2025-10-03 08:55:44',
    '2025-10-03 08:55:47',
    '2025-10-03 08:57:32'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'www.ebay.com',
    'https://www.ebay.com/item/55504',
    'SUCCESS',
    '2025-10-03 11:05:26',
    '2025-10-03 11:05:29',
    '2025-10-03 11:06:00'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'buy.yahoo.com',
    'https://buy.yahoo.com/item/64641',
    'FAILED',
    '2025-10-03 05:39:27',
    '2025-10-03 05:39:29',
    '2025-10-03 05:41:23'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'buy.yahoo.com',
    'https://buy.yahoo.com/item/58883',
    'RAG_PROCESS_FAILED',
    '2025-10-03 08:21:24',
    '2025-10-03 08:21:25',
    '2025-10-03 08:23:00'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'buy.yahoo.com',
    'https://buy.yahoo.com/item/11145',
    'SUCCESS',
    '2025-10-03 09:41:28',
    '2025-10-03 09:41:28',
    '2025-10-03 09:42:05'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'buy.yahoo.com',
    'https://buy.yahoo.com/item/99747',
    'RAG_PROCESS_FAILED',
    '2025-10-03 05:44:13',
    '2025-10-03 05:44:13',
    '2025-10-03 05:45:25'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'www.amazon.com',
    'https://www.amazon.com/item/28771',
    'SUCCESS',
    '2025-10-03 04:44:21',
    '2025-10-03 04:44:22',
    '2025-10-03 04:45:48'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'www.ebay.com',
    'https://www.ebay.com/item/81805',
    'RAG_PROCESSED',
    '2025-10-03 09:40:05',
    '2025-10-03 09:40:09',
    '2025-10-03 09:42:08'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'buy.yahoo.com',
    'https://buy.yahoo.com/item/19186',
    'SUCCESS',
    '2025-10-03 10:19:56',
    '2025-10-03 10:20:01',
    '2025-10-03 10:20:52'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'www.amazon.com',
    'https://www.amazon.com/item/87488',
    'SUCCESS',
    '2025-10-03 05:00:59',
    '2025-10-03 05:01:02',
    '2025-10-03 05:01:33'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'www.amazon.com',
    'https://www.amazon.com/item/72098',
    'RAG_PROCESSED',
    '2025-10-03 10:30:37',
    '2025-10-03 10:30:37',
    '2025-10-03 10:31:28'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'www.ebay.com',
    'https://www.ebay.com/item/17537',
    'RAG_PROCESSED',
    '2025-10-03 04:33:26',
    '2025-10-03 04:33:28',
    '2025-10-03 04:35:12'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'buy.yahoo.com',
    'https://buy.yahoo.com/item/30834',
    'RAG_PROCESSED',
    '2025-10-03 07:51:05',
    '2025-10-03 07:51:05',
    '2025-10-03 07:51:25'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'buy.yahoo.com',
    'https://buy.yahoo.com/item/69063',
    'RAG_PROCESSED',
    '2025-10-03 10:12:35',
    '2025-10-03 10:12:37',
    '2025-10-03 10:13:09'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'www.amazon.com',
    'https://www.amazon.com/item/72459',
    'SUCCESS',
    '2025-10-03 06:19:46',
    '2025-10-03 06:19:48',
    '2025-10-03 06:20:49'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'buy.yahoo.com',
    'https://buy.yahoo.com/item/66660',
    'SUCCESS',
    '2025-10-03 07:31:52',
    '2025-10-03 07:31:53',
    '2025-10-03 07:32:59'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'buy.yahoo.com',
    'https://buy.yahoo.com/item/47005',
    'RUNNING',
    '2025-10-03 09:01:03',
    '2025-10-03 09:01:05',
    NULL
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'buy.yahoo.com',
    'https://buy.yahoo.com/item/29279',
    'SUCCESS',
    '2025-10-03 07:14:08',
    '2025-10-03 07:14:11',
    '2025-10-03 07:14:52'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'www.amazon.com',
    'https://www.amazon.com/item/80504',
    'RAG_PROCESS_FAILED',
    '2025-10-03 10:05:29',
    '2025-10-03 10:05:30',
    '2025-10-03 10:06:59'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'buy.yahoo.com',
    'https://buy.yahoo.com/item/31314',
    'SUCCESS',
    '2025-10-03 09:01:56',
    '2025-10-03 09:01:58',
    '2025-10-03 09:03:34'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'www.ebay.com',
    'https://www.ebay.com/item/96327',
    'SUCCESS',
    '2025-10-03 10:59:52',
    '2025-10-03 10:59:53',
    '2025-10-03 11:00:18'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'www.amazon.com',
    'https://www.amazon.com/item/25100',
    'RAG_PROCESSED',
    '2025-10-03 09:13:13',
    '2025-10-03 09:13:18',
    '2025-10-03 09:15:05'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'www.amazon.com',
    'https://www.amazon.com/item/31284',
    'SUCCESS',
    '2025-10-03 10:57:42',
    '2025-10-03 10:57:45',
    '2025-10-03 10:59:05'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'www.amazon.com',
    'https://www.amazon.com/item/85310',
    'SUCCESS',
    '2025-10-03 03:50:07',
    '2025-10-03 03:50:12',
    '2025-10-03 03:51:33'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'www.amazon.com',
    'https://www.amazon.com/item/67506',
    'FAILED',
    '2025-10-03 07:24:44',
    '2025-10-03 07:24:46',
    '2025-10-03 07:26:08'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'www.ebay.com',
    'https://www.ebay.com/item/40831',
    'SUCCESS',
    '2025-10-03 04:05:37',
    '2025-10-03 04:05:39',
    '2025-10-03 04:06:03'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'buy.yahoo.com',
    'https://buy.yahoo.com/item/99525',
    'SUCCESS',
    '2025-10-03 05:20:15',
    '2025-10-03 05:20:16',
    '2025-10-03 05:21:15'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'www.amazon.com',
    'https://www.amazon.com/item/19695',
    'SUCCESS',
    '2025-10-03 09:31:52',
    '2025-10-03 09:31:54',
    '2025-10-03 09:33:24'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'www.amazon.com',
    'https://www.amazon.com/item/74695',
    'SUCCESS',
    '2025-10-03 05:20:19',
    '2025-10-03 05:20:22',
    '2025-10-03 05:21:18'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'www.amazon.com',
    'https://www.amazon.com/item/90671',
    'RAG_PROCESSED',
    '2025-10-03 09:13:28',
    '2025-10-03 09:13:28',
    '2025-10-03 09:13:56'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'www.ebay.com',
    'https://www.ebay.com/item/15486',
    'SUCCESS',
    '2025-10-03 03:25:24',
    '2025-10-03 03:25:24',
    '2025-10-03 03:26:47'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'www.amazon.com',
    'https://www.amazon.com/item/79269',
    'SUCCESS',
    '2025-10-03 10:44:22',
    '2025-10-03 10:44:22',
    '2025-10-03 10:44:51'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'www.amazon.com',
    'https://www.amazon.com/item/49645',
    'SUCCESS',
    '2025-10-03 09:20:34',
    '2025-10-03 09:20:34',
    '2025-10-03 09:21:45'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'www.ebay.com',
    'https://www.ebay.com/item/87169',
    'SUCCESS',
    '2025-10-03 07:02:54',
    '2025-10-03 07:02:54',
    '2025-10-03 07:03:54'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'buy.yahoo.com',
    'https://buy.yahoo.com/item/55317',
    'RAG_PROCESSED',
    '2025-10-03 07:36:41',
    '2025-10-03 07:36:45',
    '2025-10-03 07:38:32'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'buy.yahoo.com',
    'https://buy.yahoo.com/item/89586',
    'SUCCESS',
    '2025-10-03 09:30:54',
    '2025-10-03 09:30:59',
    '2025-10-03 09:32:05'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'www.amazon.com',
    'https://www.amazon.com/item/20052',
    'RAG_PROCESSED',
    '2025-10-03 10:00:44',
    '2025-10-03 10:00:49',
    '2025-10-03 10:01:45'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'www.amazon.com',
    'https://www.amazon.com/item/27683',
    'FAILED',
    '2025-10-03 04:57:27',
    '2025-10-03 04:57:27',
    '2025-10-03 04:57:55'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'www.amazon.com',
    'https://www.amazon.com/item/86509',
    'RAG_PROCESSED',
    '2025-10-03 05:24:22',
    '2025-10-03 05:24:22',
    '2025-10-03 05:26:21'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'www.ebay.com',
    'https://www.ebay.com/item/28129',
    'RAG_PROCESS_FAILED',
    '2025-10-03 11:03:36',
    '2025-10-03 11:03:36',
    '2025-10-03 11:04:10'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'www.amazon.com',
    'https://www.amazon.com/item/37012',
    'SUCCESS',
    '2025-10-03 06:41:48',
    '2025-10-03 06:41:48',
    '2025-10-03 06:42:40'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'buy.yahoo.com',
    'https://buy.yahoo.com/item/11354',
    'RAG_PROCESSED',
    '2025-10-03 05:46:57',
    '2025-10-03 05:47:02',
    '2025-10-03 05:47:54'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'buy.yahoo.com',
    'https://buy.yahoo.com/item/66789',
    'RAG_PROCESSED',
    '2025-10-03 07:44:38',
    '2025-10-03 07:44:40',
    '2025-10-03 07:45:38'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'www.amazon.com',
    'https://www.amazon.com/item/60129',
    'SUCCESS',
    '2025-10-03 08:15:41',
    '2025-10-03 08:15:42',
    '2025-10-03 08:16:49'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'buy.yahoo.com',
    'https://buy.yahoo.com/item/18424',
    'SUCCESS',
    '2025-10-03 05:25:24',
    '2025-10-03 05:25:24',
    '2025-10-03 05:27:02'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'www.amazon.com',
    'https://www.amazon.com/item/85372',
    'SUCCESS',
    '2025-10-03 10:23:04',
    '2025-10-03 10:23:04',
    '2025-10-03 10:24:03'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'buy.yahoo.com',
    'https://buy.yahoo.com/item/44846',
    'SUCCESS',
    '2025-10-03 07:13:59',
    '2025-10-03 07:14:00',
    '2025-10-03 07:15:06'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'buy.yahoo.com',
    'https://buy.yahoo.com/item/62856',
    'SUCCESS',
    '2025-10-03 10:34:21',
    '2025-10-03 10:34:23',
    '2025-10-03 10:35:28'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'buy.yahoo.com',
    'https://buy.yahoo.com/item/70954',
    'SUCCESS',
    '2025-10-03 09:54:05',
    '2025-10-03 09:54:10',
    '2025-10-03 09:55:57'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'www.ebay.com',
    'https://www.ebay.com/item/99973',
    'SUCCESS',
    '2025-10-03 10:27:33',
    '2025-10-03 10:27:37',
    '2025-10-03 10:28:50'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'www.amazon.com',
    'https://www.amazon.com/item/72143',
    'SUCCESS',
    '2025-10-03 03:25:06',
    '2025-10-03 03:25:10',
    '2025-10-03 03:25:47'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'buy.yahoo.com',
    'https://buy.yahoo.com/item/56308',
    'RUNNING',
    '2025-10-03 09:27:05',
    '2025-10-03 09:27:08',
    NULL
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'www.amazon.com',
    'https://www.amazon.com/item/39915',
    'SUCCESS',
    '2025-10-03 06:51:57',
    '2025-10-03 06:51:59',
    '2025-10-03 06:53:15'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'buy.yahoo.com',
    'https://buy.yahoo.com/item/47801',
    'RAG_PROCESS_FAILED',
    '2025-10-03 06:40:00',
    '2025-10-03 06:40:02',
    '2025-10-03 06:41:59'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'buy.yahoo.com',
    'https://buy.yahoo.com/item/91609',
    'RAG_PROCESSED',
    '2025-10-03 04:58:53',
    '2025-10-03 04:58:58',
    '2025-10-03 04:59:54'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'buy.yahoo.com',
    'https://buy.yahoo.com/item/90493',
    'RUNNING',
    '2025-10-03 04:12:02',
    '2025-10-03 04:12:07',
    NULL
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'www.ebay.com',
    'https://www.ebay.com/item/99108',
    'FAILED',
    '2025-10-03 04:11:49',
    '2025-10-03 04:11:53',
    '2025-10-03 04:12:32'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'buy.yahoo.com',
    'https://buy.yahoo.com/item/29690',
    'SUCCESS',
    '2025-10-03 05:41:15',
    '2025-10-03 05:41:15',
    '2025-10-03 05:41:49'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'www.ebay.com',
    'https://www.ebay.com/item/89173',
    'SUCCESS',
    '2025-10-03 08:51:31',
    '2025-10-03 08:51:35',
    '2025-10-03 08:52:15'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'buy.yahoo.com',
    'https://buy.yahoo.com/item/27565',
    'FAILED',
    '2025-10-03 10:17:20',
    '2025-10-03 10:17:22',
    '2025-10-03 10:18:18'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'www.ebay.com',
    'https://www.ebay.com/item/16042',
    'RAG_PROCESSED',
    '2025-10-03 09:20:52',
    '2025-10-03 09:20:56',
    '2025-10-03 09:22:49'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'www.ebay.com',
    'https://www.ebay.com/item/85508',
    'SUCCESS',
    '2025-10-03 07:26:48',
    '2025-10-03 07:26:53',
    '2025-10-03 07:28:17'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'buy.yahoo.com',
    'https://buy.yahoo.com/item/88591',
    'SUCCESS',
    '2025-10-03 10:51:03',
    '2025-10-03 10:51:06',
    '2025-10-03 10:51:54'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'www.amazon.com',
    'https://www.amazon.com/item/60655',
    'SUCCESS',
    '2025-10-03 10:33:53',
    '2025-10-03 10:33:58',
    '2025-10-03 10:35:34'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'www.amazon.com',
    'https://www.amazon.com/item/62679',
    'RAG_PROCESSED',
    '2025-10-03 09:55:34',
    '2025-10-03 09:55:35',
    '2025-10-03 09:56:54'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'www.ebay.com',
    'https://www.ebay.com/item/31096',
    'SUCCESS',
    '2025-10-03 07:44:44',
    '2025-10-03 07:44:49',
    '2025-10-03 07:45:25'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'www.amazon.com',
    'https://www.amazon.com/item/72882',
    'SUCCESS',
    '2025-10-03 09:42:35',
    '2025-10-03 09:42:38',
    '2025-10-03 09:43:55'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'buy.yahoo.com',
    'https://buy.yahoo.com/item/44778',
    'SUCCESS',
    '2025-10-03 03:37:23',
    '2025-10-03 03:37:28',
    '2025-10-03 03:37:57'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'www.ebay.com',
    'https://www.ebay.com/item/40633',
    'RAG_PROCESS_FAILED',
    '2025-10-03 05:56:37',
    '2025-10-03 05:56:37',
    '2025-10-03 05:57:45'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'buy.yahoo.com',
    'https://buy.yahoo.com/item/54781',
    'RAG_PROCESSED',
    '2025-10-03 09:32:25',
    '2025-10-03 09:32:30',
    '2025-10-03 09:32:53'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'buy.yahoo.com',
    'https://buy.yahoo.com/item/60847',
    'SUCCESS',
    '2025-10-03 09:15:13',
    '2025-10-03 09:15:13',
    '2025-10-03 09:16:49'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'www.ebay.com',
    'https://www.ebay.com/item/11480',
    'RAG_PROCESSED',
    '2025-10-03 04:06:47',
    '2025-10-03 04:06:50',
    '2025-10-03 04:08:07'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'www.ebay.com',
    'https://www.ebay.com/item/48911',
    'SUCCESS',
    '2025-10-03 04:53:51',
    '2025-10-03 04:53:51',
    '2025-10-03 04:54:22'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'www.ebay.com',
    'https://www.ebay.com/item/31420',
    'SUCCESS',
    '2025-10-03 06:07:36',
    '2025-10-03 06:07:39',
    '2025-10-03 06:09:16'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'buy.yahoo.com',
    'https://buy.yahoo.com/item/30848',
    'SUCCESS',
    '2025-10-03 10:20:44',
    '2025-10-03 10:20:49',
    '2025-10-03 10:22:30'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'www.ebay.com',
    'https://www.ebay.com/item/82209',
    'RUNNING',
    '2025-10-03 10:22:25',
    '2025-10-03 10:22:25',
    NULL
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'www.ebay.com',
    'https://www.ebay.com/item/66788',
    'SUCCESS',
    '2025-10-03 04:09:49',
    '2025-10-03 04:09:49',
    '2025-10-03 04:10:17'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'buy.yahoo.com',
    'https://buy.yahoo.com/item/49566',
    'SUCCESS',
    '2025-10-03 10:21:07',
    '2025-10-03 10:21:12',
    '2025-10-03 10:22:18'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'www.ebay.com',
    'https://www.ebay.com/item/36579',
    'RAG_PROCESSED',
    '2025-10-03 09:08:21',
    '2025-10-03 09:08:22',
    '2025-10-03 09:08:50'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'www.amazon.com',
    'https://www.amazon.com/item/26852',
    'SUCCESS',
    '2025-10-03 03:30:32',
    '2025-10-03 03:30:37',
    '2025-10-03 03:32:28'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'www.ebay.com',
    'https://www.ebay.com/item/44461',
    'SUCCESS',
    '2025-10-03 06:49:33',
    '2025-10-03 06:49:36',
    '2025-10-03 06:49:57'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'www.ebay.com',
    'https://www.ebay.com/item/49765',
    'PENDING',
    '2025-10-03 04:12:47',
    NULL,
    NULL
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'www.amazon.com',
    'https://www.amazon.com/item/65845',
    'SUCCESS',
    '2025-10-03 04:38:39',
    '2025-10-03 04:38:39',
    '2025-10-03 04:40:06'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'buy.yahoo.com',
    'https://buy.yahoo.com/item/51996',
    'SUCCESS',
    '2025-10-03 08:19:58',
    '2025-10-03 08:19:58',
    '2025-10-03 08:21:24'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'www.ebay.com',
    'https://www.ebay.com/item/61150',
    'RAG_PROCESSED',
    '2025-10-03 03:41:06',
    '2025-10-03 03:41:09',
    '2025-10-03 03:42:01'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'www.ebay.com',
    'https://www.ebay.com/item/56672',
    'RAG_PROCESSED',
    '2025-10-03 08:25:03',
    '2025-10-03 08:25:08',
    '2025-10-03 08:25:49'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'buy.yahoo.com',
    'https://buy.yahoo.com/item/58745',
    'RAG_PROCESS_FAILED',
    '2025-10-03 04:18:27',
    '2025-10-03 04:18:28',
    '2025-10-03 04:20:04'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'www.amazon.com',
    'https://www.amazon.com/item/97829',
    'SUCCESS',
    '2025-10-03 04:50:56',
    '2025-10-03 04:50:56',
    '2025-10-03 04:51:48'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'buy.yahoo.com',
    'https://buy.yahoo.com/item/20966',
    'SUCCESS',
    '2025-10-03 09:54:21',
    '2025-10-03 09:54:26',
    '2025-10-03 09:54:52'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'www.amazon.com',
    'https://www.amazon.com/item/73823',
    'SUCCESS',
    '2025-10-03 05:42:04',
    '2025-10-03 05:42:04',
    '2025-10-03 05:42:26'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'buy.yahoo.com',
    'https://buy.yahoo.com/item/73514',
    'RAG_PROCESSED',
    '2025-10-03 09:51:11',
    '2025-10-03 09:51:12',
    '2025-10-03 09:52:25'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'www.amazon.com',
    'https://www.amazon.com/item/93328',
    'RAG_PROCESSED',
    '2025-10-03 07:32:35',
    '2025-10-03 07:32:37',
    '2025-10-03 07:34:28'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'www.amazon.com',
    'https://www.amazon.com/item/51118',
    'RUNNING',
    '2025-10-03 10:15:24',
    '2025-10-03 10:15:26',
    NULL
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'buy.yahoo.com',
    'https://buy.yahoo.com/item/76192',
    'RAG_PROCESSED',
    '2025-10-03 07:02:40',
    '2025-10-03 07:02:43',
    '2025-10-03 07:03:54'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'www.amazon.com',
    'https://www.amazon.com/item/90915',
    'SUCCESS',
    '2025-10-03 10:47:12',
    '2025-10-03 10:47:16',
    '2025-10-03 10:47:39'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'www.amazon.com',
    'https://www.amazon.com/item/70360',
    'SUCCESS',
    '2025-10-03 05:28:50',
    '2025-10-03 05:28:55',
    '2025-10-03 05:30:53'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'www.amazon.com',
    'https://www.amazon.com/item/24227',
    'RAG_PROCESSED',
    '2025-10-03 10:27:10',
    '2025-10-03 10:27:15',
    '2025-10-03 10:28:27'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'www.ebay.com',
    'https://www.ebay.com/item/21709',
    'SUCCESS',
    '2025-10-03 03:14:11',
    '2025-10-03 03:14:13',
    '2025-10-03 03:15:22'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'www.amazon.com',
    'https://www.amazon.com/item/25880',
    'SUCCESS',
    '2025-10-03 08:54:14',
    '2025-10-03 08:54:17',
    '2025-10-03 08:54:48'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'buy.yahoo.com',
    'https://buy.yahoo.com/item/90504',
    'SUCCESS',
    '2025-10-03 09:08:12',
    '2025-10-03 09:08:12',
    '2025-10-03 09:09:41'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'www.amazon.com',
    'https://www.amazon.com/item/39042',
    'RAG_PROCESSED',
    '2025-10-03 06:52:47',
    '2025-10-03 06:52:52',
    '2025-10-03 06:54:41'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'www.ebay.com',
    'https://www.ebay.com/item/99213',
    'RAG_PROCESSED',
    '2025-10-03 04:29:28',
    '2025-10-03 04:29:28',
    '2025-10-03 04:31:19'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'buy.yahoo.com',
    'https://buy.yahoo.com/item/56721',
    'SUCCESS',
    '2025-10-03 05:17:54',
    '2025-10-03 05:17:55',
    '2025-10-03 05:18:47'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'www.ebay.com',
    'https://www.ebay.com/item/52859',
    'SUCCESS',
    '2025-10-03 07:59:00',
    '2025-10-03 07:59:02',
    '2025-10-03 08:00:15'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'www.ebay.com',
    'https://www.ebay.com/item/85458',
    'SUCCESS',
    '2025-10-03 07:44:16',
    '2025-10-03 07:44:19',
    '2025-10-03 07:45:33'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'buy.yahoo.com',
    'https://buy.yahoo.com/item/85041',
    'FAILED',
    '2025-10-03 07:39:06',
    '2025-10-03 07:39:09',
    '2025-10-03 07:39:52'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'www.amazon.com',
    'https://www.amazon.com/item/46275',
    'RUNNING',
    '2025-10-03 03:50:10',
    '2025-10-03 03:50:14',
    NULL
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'buy.yahoo.com',
    'https://buy.yahoo.com/item/81235',
    'RAG_PROCESSED',
    '2025-10-03 07:48:09',
    '2025-10-03 07:48:13',
    '2025-10-03 07:49:14'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'www.amazon.com',
    'https://www.amazon.com/item/34289',
    'SUCCESS',
    '2025-10-03 08:55:37',
    '2025-10-03 08:55:37',
    '2025-10-03 08:55:58'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'www.ebay.com',
    'https://www.ebay.com/item/76686',
    'SUCCESS',
    '2025-10-03 04:41:56',
    '2025-10-03 04:42:01',
    '2025-10-03 04:43:53'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'www.ebay.com',
    'https://www.ebay.com/item/25740',
    'SUCCESS',
    '2025-10-03 04:10:53',
    '2025-10-03 04:10:55',
    '2025-10-03 04:12:44'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'buy.yahoo.com',
    'https://buy.yahoo.com/item/46418',
    'SUCCESS',
    '2025-10-03 08:50:29',
    '2025-10-03 08:50:29',
    '2025-10-03 08:51:20'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'www.amazon.com',
    'https://www.amazon.com/item/32672',
    'RAG_PROCESSED',
    '2025-10-03 07:40:28',
    '2025-10-03 07:40:29',
    '2025-10-03 07:42:00'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'www.ebay.com',
    'https://www.ebay.com/item/43103',
    'SUCCESS',
    '2025-10-03 09:55:52',
    '2025-10-03 09:55:55',
    '2025-10-03 09:56:29'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'www.ebay.com',
    'https://www.ebay.com/item/95023',
    'RAG_PROCESSED',
    '2025-10-03 07:11:29',
    '2025-10-03 07:11:29',
    '2025-10-03 07:12:25'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'www.amazon.com',
    'https://www.amazon.com/item/11816',
    'SUCCESS',
    '2025-10-03 07:15:43',
    '2025-10-03 07:15:47',
    '2025-10-03 07:17:35'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'www.amazon.com',
    'https://www.amazon.com/item/47781',
    'SUCCESS',
    '2025-10-03 10:02:59',
    '2025-10-03 10:03:03',
    '2025-10-03 10:04:48'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'www.amazon.com',
    'https://www.amazon.com/item/22738',
    'SUCCESS',
    '2025-10-03 09:46:57',
    '2025-10-03 09:46:58',
    '2025-10-03 09:48:43'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'buy.yahoo.com',
    'https://buy.yahoo.com/item/72310',
    'RAG_PROCESSED',
    '2025-10-03 11:04:49',
    '2025-10-03 11:04:53',
    '2025-10-03 11:06:51'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'buy.yahoo.com',
    'https://buy.yahoo.com/item/53391',
    'RAG_PROCESSED',
    '2025-10-03 10:12:05',
    '2025-10-03 10:12:06',
    '2025-10-03 10:13:24'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'www.ebay.com',
    'https://www.ebay.com/item/73433',
    'RAG_PROCESSED',
    '2025-10-03 08:45:53',
    '2025-10-03 08:45:56',
    '2025-10-03 08:47:55'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'www.amazon.com',
    'https://www.amazon.com/item/87761',
    'FAILED',
    '2025-10-03 08:29:33',
    '2025-10-03 08:29:38',
    '2025-10-03 08:31:31'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'www.amazon.com',
    'https://www.amazon.com/item/59888',
    'SUCCESS',
    '2025-10-03 07:27:38',
    '2025-10-03 07:27:42',
    '2025-10-03 07:28:36'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'buy.yahoo.com',
    'https://buy.yahoo.com/item/53456',
    'SUCCESS',
    '2025-10-03 10:17:59',
    '2025-10-03 10:18:04',
    '2025-10-03 10:19:58'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'buy.yahoo.com',
    'https://buy.yahoo.com/item/56550',
    'RAG_PROCESSED',
    '2025-10-03 08:37:12',
    '2025-10-03 08:37:13',
    '2025-10-03 08:37:34'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'www.amazon.com',
    'https://www.amazon.com/item/90588',
    'SUCCESS',
    '2025-10-03 07:18:51',
    '2025-10-03 07:18:53',
    '2025-10-03 07:20:40'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'buy.yahoo.com',
    'https://buy.yahoo.com/item/33813',
    'PENDING',
    '2025-10-03 05:18:30',
    NULL,
    NULL
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'www.amazon.com',
    'https://www.amazon.com/item/16530',
    'SUCCESS',
    '2025-10-03 07:59:12',
    '2025-10-03 07:59:12',
    '2025-10-03 08:01:01'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'www.ebay.com',
    'https://www.ebay.com/item/27446',
    'SUCCESS',
    '2025-10-03 04:13:47',
    '2025-10-03 04:13:49',
    '2025-10-03 04:15:36'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'www.ebay.com',
    'https://www.ebay.com/item/29381',
    'SUCCESS',
    '2025-10-03 08:18:08',
    '2025-10-03 08:18:08',
    '2025-10-03 08:19:35'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'buy.yahoo.com',
    'https://buy.yahoo.com/item/22903',
    'FAILED',
    '2025-10-03 09:27:23',
    '2025-10-03 09:27:28',
    '2025-10-03 09:27:54'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'www.amazon.com',
    'https://www.amazon.com/item/60664',
    'RAG_PROCESSED',
    '2025-10-03 05:15:22',
    '2025-10-03 05:15:27',
    '2025-10-03 05:16:03'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'buy.yahoo.com',
    'https://buy.yahoo.com/item/25297',
    'RAG_PROCESSED',
    '2025-10-03 05:24:28',
    '2025-10-03 05:24:30',
    '2025-10-03 05:26:29'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'buy.yahoo.com',
    'https://buy.yahoo.com/item/73695',
    'SUCCESS',
    '2025-10-03 09:30:08',
    '2025-10-03 09:30:13',
    '2025-10-03 09:31:46'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'www.ebay.com',
    'https://www.ebay.com/item/84589',
    'SUCCESS',
    '2025-10-03 05:08:12',
    '2025-10-03 05:08:16',
    '2025-10-03 05:10:14'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'www.ebay.com',
    'https://www.ebay.com/item/51348',
    'SUCCESS',
    '2025-10-03 08:37:05',
    '2025-10-03 08:37:06',
    '2025-10-03 08:37:28'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'www.ebay.com',
    'https://www.ebay.com/item/32002',
    'SUCCESS',
    '2025-10-03 06:44:25',
    '2025-10-03 06:44:28',
    '2025-10-03 06:45:58'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'www.amazon.com',
    'https://www.amazon.com/item/35933',
    'PENDING',
    '2025-10-03 05:01:40',
    NULL,
    NULL
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'www.ebay.com',
    'https://www.ebay.com/item/79278',
    'SUCCESS',
    '2025-10-03 10:29:25',
    '2025-10-03 10:29:26',
    '2025-10-03 10:30:36'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'buy.yahoo.com',
    'https://buy.yahoo.com/item/44731',
    'SUCCESS',
    '2025-10-03 03:17:53',
    '2025-10-03 03:17:53',
    '2025-10-03 03:19:17'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'www.ebay.com',
    'https://www.ebay.com/item/13159',
    'SUCCESS',
    '2025-10-03 06:27:18',
    '2025-10-03 06:27:22',
    '2025-10-03 06:28:42'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'www.amazon.com',
    'https://www.amazon.com/item/96010',
    'FAILED',
    '2025-10-03 07:35:00',
    '2025-10-03 07:35:02',
    '2025-10-03 07:35:54'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'www.amazon.com',
    'https://www.amazon.com/item/21823',
    'RAG_PROCESSED',
    '2025-10-03 05:21:00',
    '2025-10-03 05:21:03',
    '2025-10-03 05:22:17'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'buy.yahoo.com',
    'https://buy.yahoo.com/item/34600',
    'FAILED',
    '2025-10-03 05:30:40',
    '2025-10-03 05:30:44',
    '2025-10-03 05:31:06'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'www.amazon.com',
    'https://www.amazon.com/item/79193',
    'SUCCESS',
    '2025-10-03 07:47:25',
    '2025-10-03 07:47:28',
    '2025-10-03 07:49:21'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'www.amazon.com',
    'https://www.amazon.com/item/74909',
    'SUCCESS',
    '2025-10-03 06:00:42',
    '2025-10-03 06:00:43',
    '2025-10-03 06:02:01'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'www.ebay.com',
    'https://www.ebay.com/item/37849',
    'RAG_PROCESS_FAILED',
    '2025-10-03 06:14:32',
    '2025-10-03 06:14:36',
    '2025-10-03 06:16:34'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'www.amazon.com',
    'https://www.amazon.com/item/73868',
    'SUCCESS',
    '2025-10-03 06:17:19',
    '2025-10-03 06:17:22',
    '2025-10-03 06:18:04'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'www.amazon.com',
    'https://www.amazon.com/item/57909',
    'SUCCESS',
    '2025-10-03 04:06:28',
    '2025-10-03 04:06:33',
    '2025-10-03 04:07:31'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'buy.yahoo.com',
    'https://buy.yahoo.com/item/86231',
    'SUCCESS',
    '2025-10-03 03:22:52',
    '2025-10-03 03:22:53',
    '2025-10-03 03:23:14'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'www.ebay.com',
    'https://www.ebay.com/item/55518',
    'RAG_PROCESSED',
    '2025-10-03 09:08:24',
    '2025-10-03 09:08:27',
    '2025-10-03 09:10:25'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'www.amazon.com',
    'https://www.amazon.com/item/61904',
    'RAG_PROCESSED',
    '2025-10-03 08:58:21',
    '2025-10-03 08:58:22',
    '2025-10-03 09:00:21'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'www.amazon.com',
    'https://www.amazon.com/item/35830',
    'RAG_PROCESSED',
    '2025-10-03 08:27:23',
    '2025-10-03 08:27:26',
    '2025-10-03 08:28:28'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'www.amazon.com',
    'https://www.amazon.com/item/87141',
    'SUCCESS',
    '2025-10-03 09:57:22',
    '2025-10-03 09:57:24',
    '2025-10-03 09:58:28'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'buy.yahoo.com',
    'https://buy.yahoo.com/item/45221',
    'SUCCESS',
    '2025-10-03 07:31:00',
    '2025-10-03 07:31:04',
    '2025-10-03 07:31:55'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'www.amazon.com',
    'https://www.amazon.com/item/71535',
    'SUCCESS',
    '2025-10-03 06:16:29',
    '2025-10-03 06:16:33',
    '2025-10-03 06:17:54'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'www.ebay.com',
    'https://www.ebay.com/item/39012',
    'SUCCESS',
    '2025-10-03 10:53:08',
    '2025-10-03 10:53:12',
    '2025-10-03 10:55:05'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'buy.yahoo.com',
    'https://buy.yahoo.com/item/31784',
    'SUCCESS',
    '2025-10-03 04:46:05',
    '2025-10-03 04:46:10',
    '2025-10-03 04:46:45'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'www.amazon.com',
    'https://www.amazon.com/item/43265',
    'SUCCESS',
    '2025-10-03 09:13:06',
    '2025-10-03 09:13:07',
    '2025-10-03 09:15:00'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'www.ebay.com',
    'https://www.ebay.com/item/81830',
    'SUCCESS',
    '2025-10-03 11:01:03',
    '2025-10-03 11:01:05',
    '2025-10-03 11:02:49'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'buy.yahoo.com',
    'https://buy.yahoo.com/item/48797',
    'RAG_PROCESSED',
    '2025-10-03 11:05:01',
    '2025-10-03 11:05:04',
    '2025-10-03 11:06:59'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'buy.yahoo.com',
    'https://buy.yahoo.com/item/78953',
    'RAG_PROCESSED',
    '2025-10-03 06:06:03',
    '2025-10-03 06:06:07',
    '2025-10-03 06:07:01'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'www.amazon.com',
    'https://www.amazon.com/item/19207',
    'SUCCESS',
    '2025-10-03 10:24:04',
    '2025-10-03 10:24:05',
    '2025-10-03 10:24:50'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'www.ebay.com',
    'https://www.ebay.com/item/32584',
    'SUCCESS',
    '2025-10-03 07:40:41',
    '2025-10-03 07:40:44',
    '2025-10-03 07:42:11'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'www.amazon.com',
    'https://www.amazon.com/item/76637',
    'RAG_PROCESSED',
    '2025-10-03 09:43:11',
    '2025-10-03 09:43:11',
    '2025-10-03 09:44:57'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'www.ebay.com',
    'https://www.ebay.com/item/57998',
    'RAG_PROCESSED',
    '2025-10-03 04:59:40',
    '2025-10-03 04:59:43',
    '2025-10-03 05:00:53'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'www.ebay.com',
    'https://www.ebay.com/item/45603',
    'SUCCESS',
    '2025-10-03 07:43:56',
    '2025-10-03 07:43:58',
    '2025-10-03 07:45:46'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'www.ebay.com',
    'https://www.ebay.com/item/61037',
    'PENDING',
    '2025-10-03 05:08:54',
    NULL,
    NULL
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'www.ebay.com',
    'https://www.ebay.com/item/50163',
    'RAG_PROCESSED',
    '2025-10-03 10:35:12',
    '2025-10-03 10:35:15',
    '2025-10-03 10:36:38'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'www.ebay.com',
    'https://www.ebay.com/item/24051',
    'SUCCESS',
    '2025-10-03 07:12:50',
    '2025-10-03 07:12:54',
    '2025-10-03 07:13:45'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'buy.yahoo.com',
    'https://buy.yahoo.com/item/52181',
    'RAG_PROCESSED',
    '2025-10-03 10:03:13',
    '2025-10-03 10:03:18',
    '2025-10-03 10:03:59'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'www.ebay.com',
    'https://www.ebay.com/item/53756',
    'SUCCESS',
    '2025-10-03 08:31:21',
    '2025-10-03 08:31:21',
    '2025-10-03 08:32:27'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'www.ebay.com',
    'https://www.ebay.com/item/97869',
    'RAG_PROCESSED',
    '2025-10-03 07:06:50',
    '2025-10-03 07:06:55',
    '2025-10-03 07:08:09'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'buy.yahoo.com',
    'https://buy.yahoo.com/item/96748',
    'RAG_PROCESSED',
    '2025-10-03 10:55:42',
    '2025-10-03 10:55:44',
    '2025-10-03 10:57:29'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'buy.yahoo.com',
    'https://buy.yahoo.com/item/47320',
    'RAG_PROCESSED',
    '2025-10-03 07:45:09',
    '2025-10-03 07:45:12',
    '2025-10-03 07:45:43'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'www.amazon.com',
    'https://www.amazon.com/item/25864',
    'PENDING',
    '2025-10-03 06:12:18',
    NULL,
    NULL
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'www.amazon.com',
    'https://www.amazon.com/item/12588',
    'RAG_PROCESSED',
    '2025-10-03 06:25:47',
    '2025-10-03 06:25:52',
    '2025-10-03 06:27:05'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'www.ebay.com',
    'https://www.ebay.com/item/63141',
    'RAG_PROCESSED',
    '2025-10-03 08:14:24',
    '2025-10-03 08:14:26',
    '2025-10-03 08:14:47'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'www.ebay.com',
    'https://www.ebay.com/item/77842',
    'RAG_PROCESSED',
    '2025-10-03 10:03:14',
    '2025-10-03 10:03:19',
    '2025-10-03 10:05:08'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'buy.yahoo.com',
    'https://buy.yahoo.com/item/23708',
    'RAG_PROCESS_FAILED',
    '2025-10-03 09:11:48',
    '2025-10-03 09:11:53',
    '2025-10-03 09:12:50'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'www.ebay.com',
    'https://www.ebay.com/item/50170',
    'RAG_PROCESSED',
    '2025-10-03 08:24:55',
    '2025-10-03 08:25:00',
    '2025-10-03 08:26:43'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'www.ebay.com',
    'https://www.ebay.com/item/33398',
    'RAG_PROCESSED',
    '2025-10-03 10:29:09',
    '2025-10-03 10:29:13',
    '2025-10-03 10:30:40'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'www.amazon.com',
    'https://www.amazon.com/item/43320',
    'SUCCESS',
    '2025-10-03 07:19:11',
    '2025-10-03 07:19:14',
    '2025-10-03 07:19:50'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'buy.yahoo.com',
    'https://buy.yahoo.com/item/62061',
    'SUCCESS',
    '2025-10-03 09:39:43',
    '2025-10-03 09:39:45',
    '2025-10-03 09:41:24'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'www.amazon.com',
    'https://www.amazon.com/item/98407',
    'SUCCESS',
    '2025-10-03 10:50:35',
    '2025-10-03 10:50:40',
    '2025-10-03 10:51:43'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'www.ebay.com',
    'https://www.ebay.com/item/25911',
    'RAG_PROCESSED',
    '2025-10-03 08:32:40',
    '2025-10-03 08:32:45',
    '2025-10-03 08:34:12'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'buy.yahoo.com',
    'https://buy.yahoo.com/item/59619',
    'RAG_PROCESSED',
    '2025-10-03 03:46:33',
    '2025-10-03 03:46:37',
    '2025-10-03 03:47:54'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'www.ebay.com',
    'https://www.ebay.com/item/11640',
    'SUCCESS',
    '2025-10-03 04:59:22',
    '2025-10-03 04:59:23',
    '2025-10-03 05:00:49'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'buy.yahoo.com',
    'https://buy.yahoo.com/item/85905',
    'RAG_PROCESSED',
    '2025-10-03 09:13:09',
    '2025-10-03 09:13:10',
    '2025-10-03 09:14:41'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'buy.yahoo.com',
    'https://buy.yahoo.com/item/59561',
    'RAG_PROCESS_FAILED',
    '2025-10-03 04:33:44',
    '2025-10-03 04:33:47',
    '2025-10-03 04:34:32'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'www.ebay.com',
    'https://www.ebay.com/item/55358',
    'SUCCESS',
    '2025-10-03 09:55:35',
    '2025-10-03 09:55:36',
    '2025-10-03 09:56:47'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'www.ebay.com',
    'https://www.ebay.com/item/14484',
    'RAG_PROCESSED',
    '2025-10-03 08:26:45',
    '2025-10-03 08:26:47',
    '2025-10-03 08:28:08'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'buy.yahoo.com',
    'https://buy.yahoo.com/item/12358',
    'SUCCESS',
    '2025-10-03 06:25:04',
    '2025-10-03 06:25:09',
    '2025-10-03 06:26:51'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'www.amazon.com',
    'https://www.amazon.com/item/27648',
    'SUCCESS',
    '2025-10-03 04:00:37',
    '2025-10-03 04:00:41',
    '2025-10-03 04:02:24'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'buy.yahoo.com',
    'https://buy.yahoo.com/item/79042',
    'PENDING',
    '2025-10-03 07:23:30',
    NULL,
    NULL
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'www.amazon.com',
    'https://www.amazon.com/item/29108',
    'SUCCESS',
    '2025-10-03 04:50:56',
    '2025-10-03 04:50:59',
    '2025-10-03 04:52:18'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'www.amazon.com',
    'https://www.amazon.com/item/45868',
    'SUCCESS',
    '2025-10-03 04:28:13',
    '2025-10-03 04:28:18',
    '2025-10-03 04:29:49'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'www.ebay.com',
    'https://www.ebay.com/item/69431',
    'SUCCESS',
    '2025-10-03 03:39:48',
    '2025-10-03 03:39:50',
    '2025-10-03 03:40:39'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'www.ebay.com',
    'https://www.ebay.com/item/70145',
    'RAG_PROCESSED',
    '2025-10-03 04:24:25',
    '2025-10-03 04:24:27',
    '2025-10-03 04:25:04'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'www.ebay.com',
    'https://www.ebay.com/item/92351',
    'SUCCESS',
    '2025-10-03 08:15:48',
    '2025-10-03 08:15:50',
    '2025-10-03 08:17:31'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'www.ebay.com',
    'https://www.ebay.com/item/49461',
    'RAG_PROCESSED',
    '2025-10-03 09:30:52',
    '2025-10-03 09:30:57',
    '2025-10-03 09:31:23'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'www.amazon.com',
    'https://www.amazon.com/item/17301',
    'SUCCESS',
    '2025-10-03 09:46:43',
    '2025-10-03 09:46:43',
    '2025-10-03 09:48:00'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'www.ebay.com',
    'https://www.ebay.com/item/45915',
    'SUCCESS',
    '2025-10-03 07:33:38',
    '2025-10-03 07:33:42',
    '2025-10-03 07:34:33'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'www.amazon.com',
    'https://www.amazon.com/item/39676',
    'SUCCESS',
    '2025-10-03 07:05:23',
    '2025-10-03 07:05:23',
    '2025-10-03 07:07:11'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'buy.yahoo.com',
    'https://buy.yahoo.com/item/93776',
    'SUCCESS',
    '2025-10-03 08:29:21',
    '2025-10-03 08:29:26',
    '2025-10-03 08:31:18'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'www.amazon.com',
    'https://www.amazon.com/item/14919',
    'RAG_PROCESSED',
    '2025-10-03 08:18:54',
    '2025-10-03 08:18:56',
    '2025-10-03 08:20:02'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'www.amazon.com',
    'https://www.amazon.com/item/79837',
    'SUCCESS',
    '2025-10-03 10:02:01',
    '2025-10-03 10:02:04',
    '2025-10-03 10:02:33'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'buy.yahoo.com',
    'https://buy.yahoo.com/item/48307',
    'SUCCESS',
    '2025-10-03 06:07:56',
    '2025-10-03 06:08:00',
    '2025-10-03 06:09:20'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'www.amazon.com',
    'https://www.amazon.com/item/30601',
    'SUCCESS',
    '2025-10-03 04:45:56',
    '2025-10-03 04:45:56',
    '2025-10-03 04:47:37'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'www.amazon.com',
    'https://www.amazon.com/item/45141',
    'SUCCESS',
    '2025-10-03 10:46:58',
    '2025-10-03 10:47:02',
    '2025-10-03 10:47:25'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'www.ebay.com',
    'https://www.ebay.com/item/55461',
    'RAG_PROCESSED',
    '2025-10-03 06:52:55',
    '2025-10-03 06:52:59',
    '2025-10-03 06:54:20'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'www.amazon.com',
    'https://www.amazon.com/item/83689',
    'PENDING',
    '2025-10-03 08:34:07',
    NULL,
    NULL
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'buy.yahoo.com',
    'https://buy.yahoo.com/item/49544',
    'RAG_PROCESSED',
    '2025-10-03 08:28:21',
    '2025-10-03 08:28:25',
    '2025-10-03 08:29:32'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'buy.yahoo.com',
    'https://buy.yahoo.com/item/23934',
    'SUCCESS',
    '2025-10-03 10:29:38',
    '2025-10-03 10:29:41',
    '2025-10-03 10:31:39'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'buy.yahoo.com',
    'https://buy.yahoo.com/item/81823',
    'SUCCESS',
    '2025-10-03 04:50:08',
    '2025-10-03 04:50:10',
    '2025-10-03 04:51:49'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'www.ebay.com',
    'https://www.ebay.com/item/32262',
    'SUCCESS',
    '2025-10-03 07:26:17',
    '2025-10-03 07:26:20',
    '2025-10-03 07:27:38'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'buy.yahoo.com',
    'https://buy.yahoo.com/item/31102',
    'SUCCESS',
    '2025-10-03 10:05:43',
    '2025-10-03 10:05:46',
    '2025-10-03 10:07:35'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'www.ebay.com',
    'https://www.ebay.com/item/78942',
    'PENDING',
    '2025-10-03 08:04:26',
    NULL,
    NULL
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'buy.yahoo.com',
    'https://buy.yahoo.com/item/33577',
    'SUCCESS',
    '2025-10-03 05:28:36',
    '2025-10-03 05:28:37',
    '2025-10-03 05:30:37'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'www.amazon.com',
    'https://www.amazon.com/item/64794',
    'SUCCESS',
    '2025-10-03 08:58:24',
    '2025-10-03 08:58:24',
    '2025-10-03 08:59:49'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'www.ebay.com',
    'https://www.ebay.com/item/41736',
    'SUCCESS',
    '2025-10-03 06:41:40',
    '2025-10-03 06:41:45',
    '2025-10-03 06:42:13'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'www.amazon.com',
    'https://www.amazon.com/item/10382',
    'SUCCESS',
    '2025-10-03 07:40:47',
    '2025-10-03 07:40:48',
    '2025-10-03 07:41:24'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'www.amazon.com',
    'https://www.amazon.com/item/83494',
    'SUCCESS',
    '2025-10-03 05:09:48',
    '2025-10-03 05:09:53',
    '2025-10-03 05:11:42'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'buy.yahoo.com',
    'https://buy.yahoo.com/item/21999',
    'SUCCESS',
    '2025-10-03 04:01:01',
    '2025-10-03 04:01:04',
    '2025-10-03 04:02:57'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'www.amazon.com',
    'https://www.amazon.com/item/46024',
    'SUCCESS',
    '2025-10-03 10:45:55',
    '2025-10-03 10:45:59',
    '2025-10-03 10:46:23'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'www.ebay.com',
    'https://www.ebay.com/item/77515',
    'SUCCESS',
    '2025-10-03 10:35:25',
    '2025-10-03 10:35:29',
    '2025-10-03 10:36:04'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'buy.yahoo.com',
    'https://buy.yahoo.com/item/19844',
    'RAG_PROCESS_FAILED',
    '2025-10-03 10:28:56',
    '2025-10-03 10:28:59',
    '2025-10-03 10:29:28'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'www.amazon.com',
    'https://www.amazon.com/item/99527',
    'FAILED',
    '2025-10-03 03:58:53',
    '2025-10-03 03:58:53',
    '2025-10-03 03:59:40'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'www.ebay.com',
    'https://www.ebay.com/item/64713',
    'RAG_PROCESSED',
    '2025-10-03 06:54:27',
    '2025-10-03 06:54:31',
    '2025-10-03 06:56:07'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'www.amazon.com',
    'https://www.amazon.com/item/46702',
    'RAG_PROCESSED',
    '2025-10-03 10:42:02',
    '2025-10-03 10:42:02',
    '2025-10-03 10:43:09'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'buy.yahoo.com',
    'https://buy.yahoo.com/item/97663',
    'RAG_PROCESS_FAILED',
    '2025-10-03 04:49:41',
    '2025-10-03 04:49:46',
    '2025-10-03 04:50:58'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'buy.yahoo.com',
    'https://buy.yahoo.com/item/60049',
    'SUCCESS',
    '2025-10-03 10:25:13',
    '2025-10-03 10:25:14',
    '2025-10-03 10:26:44'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'www.amazon.com',
    'https://www.amazon.com/item/17752',
    'SUCCESS',
    '2025-10-03 05:42:29',
    '2025-10-03 05:42:34',
    '2025-10-03 05:44:32'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'www.ebay.com',
    'https://www.ebay.com/item/33739',
    'RAG_PROCESSED',
    '2025-10-03 05:25:41',
    '2025-10-03 05:25:42',
    '2025-10-03 05:26:53'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'www.ebay.com',
    'https://www.ebay.com/item/52695',
    'RUNNING',
    '2025-10-03 06:41:22',
    '2025-10-03 06:41:26',
    NULL
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'buy.yahoo.com',
    'https://buy.yahoo.com/item/29956',
    'SUCCESS',
    '2025-10-03 03:43:15',
    '2025-10-03 03:43:17',
    '2025-10-03 03:45:08'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'www.amazon.com',
    'https://www.amazon.com/item/29433',
    'SUCCESS',
    '2025-10-03 03:10:30',
    '2025-10-03 03:10:33',
    '2025-10-03 03:11:50'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'www.amazon.com',
    'https://www.amazon.com/item/22829',
    'SUCCESS',
    '2025-10-03 04:38:20',
    '2025-10-03 04:38:23',
    '2025-10-03 04:40:02'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'www.ebay.com',
    'https://www.ebay.com/item/37314',
    'SUCCESS',
    '2025-10-03 08:42:36',
    '2025-10-03 08:42:38',
    '2025-10-03 08:44:02'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'www.amazon.com',
    'https://www.amazon.com/item/63436',
    'SUCCESS',
    '2025-10-03 04:08:35',
    '2025-10-03 04:08:40',
    '2025-10-03 04:09:55'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'buy.yahoo.com',
    'https://buy.yahoo.com/item/22783',
    'SUCCESS',
    '2025-10-03 05:24:33',
    '2025-10-03 05:24:37',
    '2025-10-03 05:26:22'
  );
INSERT INTO public.task (
    host,
    url,
    status,
    created_at,
    started_at,
    finished_at
  )
VALUES (
    'www.ebay.com',
    'https://www.ebay.com/item/28387',
    'RAG_PROCESSED',
    '2025-10-03 04:45:15',
    '2025-10-03 04:45:17',
    '2025-10-03 04:47:14'
  );
COMMIT;
