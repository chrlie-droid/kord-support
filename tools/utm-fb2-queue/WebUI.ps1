param([string]$QueueDir = "C:\UTM_FB2_Queue")
$ErrorActionPreference = "Stop"
. (Join-Path $QueueDir "Common.ps1")
Initialize-QueueFolders $QueueDir

function Send-Json($ctx, $obj, [int]$status=200) {
    $json = $obj | ConvertTo-Json -Depth 8
    $bytes = [Text.Encoding]::UTF8.GetBytes($json)
    $ctx.Response.StatusCode = $status
    $ctx.Response.ContentType = "application/json; charset=utf-8"
    $ctx.Response.ContentLength64 = $bytes.Length
    $ctx.Response.OutputStream.Write($bytes,0,$bytes.Length)
    $ctx.Response.OutputStream.Close()
}
function Send-Html($ctx, [string]$html, [int]$status=200) {
    $bytes = [Text.Encoding]::UTF8.GetBytes($html)
    $ctx.Response.StatusCode = $status
    $ctx.Response.ContentType = "text/html; charset=utf-8"
    $ctx.Response.ContentLength64 = $bytes.Length
    $ctx.Response.OutputStream.Write($bytes,0,$bytes.Length)
    $ctx.Response.OutputStream.Close()
}
function Read-Body($ctx) {
    $reader = New-Object IO.StreamReader($ctx.Request.InputStream, $ctx.Request.ContentEncoding)
    try { return $reader.ReadToEnd() } finally { $reader.Dispose() }
}
function Get-StatusData {
    $cfg = Get-QueueConfig $QueueDir
    $state = Get-State $QueueDir
    $counts = @{}
    foreach($s in @("WAITING","SENT","ACCEPTED","RETRY","ERROR","UNKNOWN","COMPLETED")) {
        $counts[$s] = @($state.items | Where-Object { $_.status -eq $s }).Count
    }
    $total = @($state.items).Count
    $done = $counts["ACCEPTED"] + $counts["COMPLETED"]
    $pct = if($total){ [math]::Round($done*100.0/$total,1) } else {0}
    $allowed = Test-InAllowedWindow $cfg
    return @{
        config = $cfg
        allowedNow = $allowed
        now = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
        nextWindowStart = if($allowed) { $null } else { (Get-NextWindowStart $cfg).ToString("yyyy-MM-dd HH:mm:ss") }
        total = $total
        done = $done
        percent = $pct
        counts = $counts
        items = $state.items
        lastAnySendUtc = $state.lastAnySendUtc
        lastGlobalError = $state.lastGlobalError
    }
}
function Save-SettingsFromBody([string]$body) {
    $incoming = $body | ConvertFrom-Json
    $cfg = Get-QueueConfig $QueueDir
    if ($incoming.UtmBaseUrl) {
        $u = [Uri][string]$incoming.UtmBaseUrl
        if ($u.Scheme -notin @("http","https")) { throw "Некорректный URL УТМ" }
        $cfg.UtmBaseUrl = ([string]$incoming.UtmBaseUrl).TrimEnd('/')
    }
    if ($null -ne $incoming.MinIntervalMinutes) {
        $v = [int]$incoming.MinIntervalMinutes
        if ($v -lt 30) { throw "Интервал не может быть меньше 30 минут" }
        $cfg.MinIntervalMinutes = $v
    }
    if ($incoming.AllowedWindowStart) {
        [void][TimeSpan]::Parse([string]$incoming.AllowedWindowStart)
        $cfg.AllowedWindowStart = [string]$incoming.AllowedWindowStart
    }
    if ($incoming.AllowedWindowEnd) {
        [void][TimeSpan]::Parse([string]$incoming.AllowedWindowEnd)
        $cfg.AllowedWindowEnd = [string]$incoming.AllowedWindowEnd
    }
    if ($null -ne $incoming.Enabled) { $cfg.Enabled = [bool]$incoming.Enabled }
    $cfg | ConvertTo-Json -Depth 5 | Set-Content (Join-Path $QueueDir "settings.json") -Encoding UTF8
    return $cfg
}

$html = @'
<!DOCTYPE html>
<html lang="ru"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>UTM FB2 Control</title>
<style>
:root{--bg:#0b1220;--p:#111827;--p2:#172033;--b:#2b3950;--t:#e5edf7;--m:#91a3bb;--g:#22c55e;--r:#ef4444;--y:#f59e0b;--c:#38bdf8}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--t);font-family:Segoe UI,Arial,sans-serif}.wrap{max-width:1400px;margin:auto;padding:24px}.top{display:flex;justify-content:space-between;gap:16px;align-items:center;margin-bottom:18px}h1{margin:0;font-size:28px}.muted{color:var(--m)}.panel{background:var(--p);border:1px solid var(--b);border-radius:14px;padding:18px;margin-bottom:16px}.status{display:flex;align-items:center;gap:10px;font-weight:700}.dot{width:11px;height:11px;border-radius:50%;background:var(--r)}.dot.on{background:var(--g)}.grid{display:grid;grid-template-columns:repeat(4,1fr);gap:12px}.card{background:var(--p2);border:1px solid var(--b);border-radius:12px;padding:14px}.n{font-size:26px;font-weight:700}.l{font-size:12px;color:var(--m)}.progress{height:26px;background:#07101d;border:1px solid var(--b);border-radius:999px;overflow:hidden}.bar{height:100%;background:linear-gradient(90deg,#22c55e,#10b981);width:0}form{display:grid;grid-template-columns:2fr 1fr 1fr 1fr;gap:12px;align-items:end}label{display:block;font-size:12px;color:var(--m);margin-bottom:6px}input{width:100%;background:#091320;color:var(--t);border:1px solid var(--b);border-radius:8px;padding:10px}button{border:0;border-radius:9px;padding:10px 14px;font-weight:700;cursor:pointer}.primary{background:#2563eb;color:white}.pause{background:#b45309;color:white}.resume{background:#15803d;color:white}.actions{display:flex;gap:8px;flex-wrap:wrap}.tablewrap{overflow:auto;max-height:620px}table{width:100%;border-collapse:collapse;min-width:900px}th,td{padding:9px 10px;border-bottom:1px solid #243147;text-align:left;font-size:13px}th{position:sticky;top:0;background:#091320}.badge{padding:3px 7px;border-radius:999px;background:#263246;font-size:11px}.err{color:#fca5a5}.retry{color:#fcd34d}.ok{color:#86efac}.sent{color:#7dd3fc}.alert{display:none;background:rgba(239,68,68,.12);border:1px solid rgba(239,68,68,.55);border-radius:14px;padding:16px;margin-bottom:16px}.alert.show{display:block}.alert-title{font-weight:800;color:#fecaca;margin-bottom:6px}.alert-msg{white-space:pre-wrap;word-break:break-word;color:#fee2e2}.http-ok{color:#86efac}.http-bad{color:#fca5a5}@media(max-width:900px){.grid{grid-template-columns:repeat(2,1fr)}form{grid-template-columns:1fr 1fr}.url{grid-column:1/-1}}
</style></head><body><div class="wrap">
<div class="top"><div><h1>UTM FB2 Control</h1><div class="muted">Очередь QueryRestBCode · управление окном доступа к УТМ</div></div><div class="status"><span id="dot" class="dot"></span><span id="mode">—</span></div></div>
<div id="lastError" class="alert"><div class="alert-title">⚠ Последняя ошибка УТМ / ЕГАИС</div><div id="lastErrorMeta" class="muted" style="margin-bottom:6px"></div><div id="lastErrorMsg" class="alert-msg"></div></div>
<div class="panel"><div style="display:flex;justify-content:space-between;margin-bottom:10px"><strong>Общий прогресс</strong><strong id="pct">0%</strong></div><div class="progress"><div id="bar" class="bar"></div></div><div class="muted" style="margin-top:9px" id="windowInfo"></div></div>
<div class="grid" id="cards"></div>
<div class="panel"><h3 style="margin-top:0">Настройки</h3><form id="settingsForm"><div class="url"><label>Адрес УТМ</label><input id="utm" placeholder="http://localhost:8085"></div><div><label>Начало окна</label><input id="start" type="time"></div><div><label>Конец окна</label><input id="end" type="time"></div><div><label>Интервал, мин.</label><input id="interval" type="number" min="30" step="1"></div></form><div class="actions" style="margin-top:12px"><button class="primary" onclick="saveSettings()">Сохранить настройки</button><button class="pause" onclick="setEnabled(false)">Приостановить очередь</button><button class="resume" onclick="setEnabled(true)">Возобновить очередь</button></div><div class="muted" style="margin-top:10px">По умолчанию отправка разрешена только с 01:00 до 11:00. Вне окна Sender и Monitor не обращаются к УТМ.</div></div>
<div class="panel"><h3 style="margin-top:0">Справки</h3><div style="display:flex;gap:10px;flex-wrap:wrap;margin-bottom:12px"><input id="fb2Search" type="text" placeholder="Поиск FB2, например 8065133474" style="flex:1;min-width:280px" oninput="applyTableFilters()"><select id="statusFilter" onchange="applyTableFilters()" style="background:#091320;color:var(--t);border:1px solid var(--b);border-radius:8px;padding:10px;min-width:210px"><option value="">Все статусы</option><option value="WAITING">Ожидает отправки</option><option value="SENT">Отправлено в УТМ</option><option value="ACCEPTED">Принято ЕГАИС</option><option value="COMPLETED">Получен баланс</option><option value="RETRY">Будет повторено</option><option value="ERROR">Ошибка</option><option value="UNKNOWN">Неизвестный ответ</option></select><button onclick="clearTableFilters()">Сбросить</button></div><div id="searchInfo" class="muted" style="margin-bottom:8px"></div><div class="tablewrap"><table><thead><tr><th>FB2</th><th>Состояние</th><th>Комментарий ЕГАИС</th><th>Последняя отправка</th><th>Последний ответ</th><th>Попыток</th><th>HTTP УТМ</th><th>TransportId Ticket</th><th>Техническая ошибка</th><th>Действие</th></tr></thead><tbody id="rows"></tbody></table></div></div>
</div><script>
let current=null;function esc(s){return (s??'').toString().replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]))}function stClass(s){return s==='ERROR'?'err':s==='RETRY'?'retry':(s==='ACCEPTED'||s==='COMPLETED')?'ok':s==='SENT'?'sent':''}function humanStatus(s){const m={WAITING:'Ожидает отправки',SENT:'Отправлено в УТМ',ACCEPTED:'Принято ЕГАИС',COMPLETED:'Получен баланс штрихкодов',RETRY:'Будет повторено',ERROR:'Ошибка',UNKNOWN:'Неизвестный ответ'};return m[s]||s||''}function fmtDate(v){if(!v)return '';const d=new Date(v);if(Number.isNaN(d.getTime()))return v;return d.toLocaleString('ru-RU')}function egaisComment(x){if(x.lastTicketComment)return x.lastTicketComment;if(x.status==='COMPLETED')return 'Получен ответ ЕГАИС с балансом штрихкодов.';if(x.status==='ACCEPTED')return 'Запрос принят ЕГАИС.';if(x.status==='SENT')return 'Ожидаем ответ ЕГАИС.';if(x.status==='WAITING')return 'Ожидает отправки.';if(x.status==='RETRY')return 'Запрос будет повторен в следующем разрешённом окне.';if(x.status==='ERROR'&&x.lastUtmError)return x.lastUtmError;return ''}
async function load(){const r=await fetch('/api/status',{cache:'no-store'});current=await r.json();document.getElementById('pct').textContent=current.done+' / '+current.total+' · '+current.percent+'%';document.getElementById('bar').style.width=current.percent+'%';const cfg=current.config;document.getElementById('utm').value=cfg.UtmBaseUrl||'';document.getElementById('start').value=cfg.AllowedWindowStart||'01:00';document.getElementById('end').value=cfg.AllowedWindowEnd||'11:00';document.getElementById('interval').value=cfg.MinIntervalMinutes||30;const active=!!cfg.Enabled&&!!current.allowedNow;document.getElementById('dot').className='dot'+(active?' on':'');document.getElementById('mode').textContent=!cfg.Enabled?'ОЧЕРЕДЬ ПРИОСТАНОВЛЕНА':current.allowedNow?'ОКНО ОТКРЫТО':'ОКНО ЗАКРЫТО';document.getElementById('windowInfo').textContent='Сейчас: '+current.now+' · Разрешено: '+cfg.AllowedWindowStart+'–'+cfg.AllowedWindowEnd+(current.nextWindowStart?' · Следующее открытие: '+current.nextWindowStart:'');const names=['COMPLETED','ACCEPTED','SENT','RETRY','ERROR','UNKNOWN','WAITING'];document.getElementById('cards').innerHTML=names.map(n=>`<div class="card"><div class="n">${current.counts[n]||0}</div><div class="l">${humanStatus(n)}</div></div>`).join('');const ge=current.lastGlobalError;const box=document.getElementById('lastError');if(ge&&ge.message){box.className='alert show';document.getElementById('lastErrorMeta').textContent=(ge.source||'')+' · '+(ge.fb2||'')+' · '+(ge.utc||'')+(ge.httpStatus?(' · HTTP '+ge.httpStatus):'');document.getElementById('lastErrorMsg').textContent=ge.message||''}else{box.className='alert'}document.getElementById('rows').innerHTML=current.items.map(x=>{const http=x.lastUtmHttpStatus??'';const httpClass=(http&&+http>=200&&+http<300)?'http-ok':(http?'http-bad':'');const comment=egaisComment(x);return `<tr data-fb2="${esc(x.fb2)}" data-status="${esc(x.status||'')}"><td>${esc(x.fb2)}</td><td class="${stClass(x.status)}"><span class="badge">${esc(humanStatus(x.status))}</span></td><td>${esc(comment)}</td><td>${esc(fmtDate(x.lastSendUtc||''))}</td><td>${esc(fmtDate(x.lastResponseUtc||''))}</td><td>${x.attempts||0}</td><td class="${httpClass}">${esc(http)}</td><td>${esc(x.ticketTransportId||'')}</td><td class="err">${esc(x.lastUtmError||'')}</td><td><button class="primary" onclick="sendNow('${esc(x.fb2)}')">Отправить</button></td></tr>`}).join('');applyTableFilters()}
async function saveSettings(){const body={UtmBaseUrl:document.getElementById('utm').value,AllowedWindowStart:document.getElementById('start').value,AllowedWindowEnd:document.getElementById('end').value,MinIntervalMinutes:+document.getElementById('interval').value,Enabled:current.config.Enabled};const r=await fetch('/api/settings',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});if(!r.ok){alert(await r.text());return}await load()}async function setEnabled(v){const body={Enabled:v};const r=await fetch('/api/settings',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});if(!r.ok){alert(await r.text());return}await load()}
function applyTableFilters(){const q=(document.getElementById('fb2Search')?.value||'').trim().toUpperCase();const st=(document.getElementById('statusFilter')?.value||'').trim();let shown=0,total=0;document.querySelectorAll('#rows tr').forEach(row=>{total++;const fb=(row.dataset.fb2||'').toUpperCase();const status=row.dataset.status||'';const okText=!q||fb.includes(q);const okStatus=!st||status===st;const show=okText&&okStatus;row.style.display=show?'':'none';if(show)shown++});const info=document.getElementById('searchInfo');if(info){if((q||st)&&shown===0)info.textContent='Справка не найдена в текущей очереди.';else if(q||st)info.textContent='Найдено: '+shown+' из '+total;else info.textContent='Всего справок: '+total}}function clearTableFilters(){const s=document.getElementById('fb2Search');if(s)s.value='';const f=document.getElementById('statusFilter');if(f)f.value='';applyTableFilters()}
async function sendNow(fb2){if(!confirm('Немедленно отправить запрос по '+fb2+'?\n\nРучная отправка игнорирует окно, паузу и интервал. ЕГАИС может отклонить запрос по лимиту частоты.'))return;const r=await fetch('/api/send-now',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({fb2})});const d=await r.json();if(!r.ok||!d.ok){alert('Ошибка:\n'+(d.error||'Неизвестная ошибка'))}else{alert('Запрос передан в УТМ: '+fb2)}await load()}load();setInterval(load,15000);
</script></body></html>
'@

$cfg = Get-QueueConfig $QueueDir
$port = [int]$cfg.WebUiPort
$listener = New-Object Net.HttpListener
$listener.Prefixes.Add("http://localhost:$port/")
$listener.Start()
Write-QLog $QueueDir "WEBUI started http://localhost:$port/"
try {
  while ($listener.IsListening) {
    $ctx = $listener.GetContext()
    try {
      $path = $ctx.Request.Url.AbsolutePath
      if ($ctx.Request.HttpMethod -eq "GET" -and $path -eq "/") { Send-Html $ctx $html }
      elseif ($ctx.Request.HttpMethod -eq "GET" -and $path -eq "/api/status") { Send-Json $ctx (Get-StatusData) }
      elseif ($ctx.Request.HttpMethod -eq "POST" -and $path -eq "/api/settings") {
        try { $body = Read-Body $ctx; $cfg2 = Save-SettingsFromBody $body; Send-Json $ctx @{ok=$true; config=$cfg2}; Write-QLog $QueueDir ("WEBUI settings updated: UTM={0} window={1}-{2} interval={3} enabled={4}" -f $cfg2.UtmBaseUrl,$cfg2.AllowedWindowStart,$cfg2.AllowedWindowEnd,$cfg2.MinIntervalMinutes,$cfg2.Enabled) } catch { Send-Json $ctx @{ok=$false; error=$_.Exception.Message} 400 }
      }
      elseif ($ctx.Request.HttpMethod -eq "POST" -and $path -eq "/api/send-now") {
        try { $body = Read-Body $ctx | ConvertFrom-Json; $fb2=[string]$body.fb2; if($fb2 -notmatch '^FB-\d{15}$'){throw "Некорректная FB2"}; $script=Join-Path $QueueDir "ForceSendFB2.ps1"; $out=& powershell.exe -NoProfile -ExecutionPolicy Bypass -File $script -FB2 $fb2 -QueueDir $QueueDir 2>&1; if($LASTEXITCODE -ne 0){throw (($out|Out-String).Trim())}; Send-Json $ctx @{ok=$true;fb2=$fb2;result=($out|Out-String).Trim()} } catch { Send-Json $ctx @{ok=$false;error=$_.Exception.Message} 400 }
      }
      else { Send-Json $ctx @{error="Not found"} 404 }
    } catch { try { Send-Json $ctx @{error=$_.Exception.Message} 500 } catch {} }
  }
} finally { $listener.Stop(); $listener.Close() }
