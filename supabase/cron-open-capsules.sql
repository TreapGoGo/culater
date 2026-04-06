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
      net.http_get(
        url:='https://seeyoulater.zeabur.app/api/cron/open-capsules',
        params:='{}'::jsonb,
        headers:=jsonb_build_object(
          'Authorization', 'Bearer REPLACE_WITH_CRON_SECRET'
        )
      ) as request_id;
    $$
  );
