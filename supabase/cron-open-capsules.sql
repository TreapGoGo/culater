create extension if not exists pg_net;
create extension if not exists pg_cron;

select cron.unschedule(jobid)
from cron.job
where jobname = 'open-capsules-every-minute';

select
  cron.schedule(
    'open-capsules-every-minute',
    '* * * * *',
    $$
    select
      net.http_post(
        url:='https://culatertest.zeabur.app/api/cron/open-capsules',
        headers:=jsonb_build_object(
          'Content-Type', 'application/json',
          'Authorization', 'Bearer REPLACE_WITH_CRON_SECRET'
        ),
        body:='{}'::jsonb
      ) as request_id;
    $$
  );
