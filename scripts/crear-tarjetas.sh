#!/usr/bin/env bash
# Carga las tarjetas de un borrador de sprint (docs/plan/sprint-NN.md) al tablero de GitHub:
#   1. crea un Issue por tarjeta (o reutiliza el que ya exista con el mismo ID en el título),
#   2. le asigna su hito (milestone de la demo; lo crea si no existe),
#   3. lo agrega al proyecto y llena sus campos: Status, Priority, Size, Estimate,
#      Start date, Target date, Sprint y Prioridad,
#   4. crea las relaciones "Blocked by" a partir de la columna "Depende de".
# Después de cargar, el tablero de GitHub es la fuente de verdad (D22).
#
# Uso:
#   scripts/crear-tarjetas.sh                                   # ensayo: muestra qué haría, no toca GitHub
#   scripts/crear-tarjetas.sh --ejecutar                        # carga docs/plan/sprint-01.md
#   scripts/crear-tarjetas.sh --ejecutar docs/plan/sprint-02.md
#
# Variables (para --ejecutar):
#   GH_PROPIETARIO   usuario u organización dueña del proyecto (ej. el usuario de Miguel)   [obligatoria]
#   GH_PROYECTO      número del proyecto (sale en su URL: .../projects/3 -> 3)              [obligatoria]
#   GH_TIPO          "user" (por defecto) u "organization"
#   GH_MIGUEL, GH_LUIS, GH_PABLO   usuarios de GitHub para asignar las tarjetas            [opcionales]
#
# Requisitos: GitHub CLI (`gh`) con sesión y permiso de proyectos:
#   gh auth login
#   gh auth refresh -s project
# Ejecutar desde la carpeta del repositorio. No necesita jq: usa el --jq que trae gh.
set -euo pipefail

EJECUTAR=0
if [[ "${1:-}" == "--ejecutar" ]]; then EJECUTAR=1; shift; fi
ARCHIVO="${1:-docs/plan/sprint-01.md}"
[[ -f "$ARCHIVO" ]] || { echo "No existe $ARCHIVO"; exit 1; }

# "sprint-01.md" -> "Sprint 1": título de la iteración en el campo Sprint
numero_sprint="$(basename "$ARCHIVO" .md)"; numero_sprint="${numero_sprint#sprint-}"
SPRINT="Sprint $((10#$numero_sprint))"

CAMPOS_OBLIGATORIOS=("Status" "Priority" "Size" "Estimate" "Start date" "Target date" "Sprint" "Prioridad")

# ---------- utilidades ----------
limpiar() { # quita espacios de los extremos y comillas invertidas
  local t="${1//\`/}"
  t="${t#"${t%%[![:space:]]*}"}"
  t="${t%"${t##*[![:space:]]}"}"
  printf '%s' "$t"
}
vacio() { [[ -z "$1" || "$1" == "—" || "$1" == "-" ]]; }

usuario() { # Nombre del integrante -> usuario de GitHub
  case "$1" in
    Miguel) echo "${GH_MIGUEL:-}";;
    Luis)   echo "${GH_LUIS:-}";;
    Pablo)  echo "${GH_PABLO:-}";;
    *)      echo "";;
  esac
}

# ---------- 1. leer la tabla del borrador ----------
IDS=()
declare -A TITULO TIPO DUENOS HORAS PRIORIDAD PRIORITY SIZE ESTIMATE INICIO FIN DEPENDE HITO CRITERIO
while IFS='|' read -r _ id titulo tipo duenos horas prioridad priority size estimate inicio fin depende hito criterio _; do
  id="$(limpiar "${id:-}")"
  [[ "$id" =~ ^S[0-9]+-[0-9]+$ ]] || continue
  IDS+=("$id")
  TITULO[$id]="$(limpiar "$titulo")";     TIPO[$id]="$(limpiar "$tipo")"
  DUENOS[$id]="$(limpiar "$duenos")";     HORAS[$id]="$(limpiar "$horas")"
  PRIORIDAD[$id]="$(limpiar "$prioridad")"; PRIORITY[$id]="$(limpiar "$priority")"
  SIZE[$id]="$(limpiar "$size")";         ESTIMATE[$id]="$(limpiar "$estimate")"
  INICIO[$id]="$(limpiar "$inicio")";     FIN[$id]="$(limpiar "$fin")"
  DEPENDE[$id]="$(limpiar "$depende")";   CRITERIO[$id]="$(limpiar "$criterio")"
  HITO[$id]="$(limpiar "$hito")"
done < "$ARCHIVO"
(( ${#IDS[@]} > 0 )) || { echo "No se encontraron tarjetas en $ARCHIVO"; exit 1; }

# Status inicial: la fase actual (P0) va a Ready; las fases siguientes esperan en Backlog
estado_de() { [[ "${PRIORITY[$1]}" == "P0" ]] && echo "Ready" || echo "Backlog"; }

# Validación del borrador: dependencias que no existen en la tabla
for id in "${IDS[@]}"; do
  vacio "${DEPENDE[$id]}" && continue
  IFS=',' read -ra deps <<< "${DEPENDE[$id]}"
  for d in "${deps[@]}"; do
    d="$(limpiar "$d")"
    [[ -n "${TITULO[$d]+x}" ]] || { echo "Error: $id depende de $d, que no está en la tabla"; exit 1; }
  done
done

# ---------- ensayo ----------
if (( ! EJECUTAR )); then
  for id in "${IDS[@]}"; do
    echo "[ensayo] $id ${TITULO[$id]}"
    echo "         dueños=${DUENOS[$id]} | Status=$(estado_de "$id") | Prioridad=${PRIORIDAD[$id]} | Priority=${PRIORITY[$id]} | Size=${SIZE[$id]} | Estimate=${ESTIMATE[$id]} | ${INICIO[$id]} → ${FIN[$id]} | Sprint=$SPRINT | Hito=${HITO[$id]} | bloqueada por: ${DEPENDE[$id]}"
  done
  echo "Tarjetas leídas: ${#IDS[@]} (sprint: $SPRINT)"
  echo "Ensayo terminado. Para cargar de verdad: scripts/crear-tarjetas.sh --ejecutar $ARCHIVO"
  exit 0
fi

# ---------- 2. preparar la ejecución ----------
command -v gh >/dev/null || { echo "Falta GitHub CLI (gh)"; exit 1; }
: "${GH_PROPIETARIO:?Define GH_PROPIETARIO (usuario u organización dueña del proyecto)}"
: "${GH_PROYECTO:?Define GH_PROYECTO (número del proyecto)}"
GH_TIPO="${GH_TIPO:-user}"
[[ "$GH_TIPO" == "user" || "$GH_TIPO" == "organization" ]] || { echo "GH_TIPO debe ser user u organization"; exit 1; }

# Campos del proyecto, sus opciones y sus iteraciones (una línea por dato, separadas por tabulador)
CONSULTA='query($login: String!, $numero: Int!) {
  '"$GH_TIPO"'(login: $login) {
    projectV2(number: $numero) {
      id
      fields(first: 50) {
        nodes {
          ... on ProjectV2Field { id name }
          ... on ProjectV2SingleSelectField { id name options { id name } }
          ... on ProjectV2IterationField { id name configuration { iterations { id title } completedIterations { id title } } }
        }
      }
    }
  }
}'
FILTRO='(.data[].projectV2) as $p
  | "PROYECTO\t\($p.id)",
    ($p.fields.nodes[] | select(.id != null) | . as $f
      | "CAMPO\t\($f.name)\t\($f.id)",
        (($f.options // [])[] | "OPCION\t\($f.name)\t\(.name)\t\(.id)"),
        ((($f.configuration.iterations // []) + ($f.configuration.completedIterations // []))[] | "ITERACION\t\($f.name)\t\(.title)\t\(.id)"))'

declare -A CAMPO OPCION ITERACION
PROYECTO_ID=""
while IFS=$'\t' read -r clase a b c; do
  case "$clase" in
    PROYECTO)  PROYECTO_ID="$a" ;;
    CAMPO)     CAMPO[$a]="$b" ;;
    OPCION)    OPCION["$a|$b"]="$c" ;;
    ITERACION) ITERACION["$a|$b"]="$c" ;;
  esac
done < <(gh api graphql -f query="$CONSULTA" -f login="$GH_PROPIETARIO" -F numero="$GH_PROYECTO" --jq "$FILTRO")
[[ -n "$PROYECTO_ID" ]] || { echo "No se encontró el proyecto $GH_PROYECTO de $GH_PROPIETARIO ($GH_TIPO)"; exit 1; }

# Validar campos y opciones ANTES de crear nada
faltan=()
for c in "${CAMPOS_OBLIGATORIOS[@]}"; do [[ -n "${CAMPO[$c]+x}" ]] || faltan+=("campo '$c'"); done
for id in "${IDS[@]}"; do
  for par in "Status|$(estado_de "$id")" "Prioridad|${PRIORIDAD[$id]}" "Priority|${PRIORITY[$id]}" "Size|${SIZE[$id]}"; do
    vacio "${par#*|}" && continue
    [[ -n "${OPCION[$par]+x}" ]] || faltan+=("opción '${par#*|}' del campo '${par%%|*}'")
  done
done
[[ -n "${ITERACION["Sprint|$SPRINT"]+x}" ]] || faltan+=("iteración '$SPRINT' del campo 'Sprint'")
if (( ${#faltan[@]} > 0 )); then
  echo "El tablero no está listo. Falta:"
  printf '%s\n' "${faltan[@]}" | sort -u | sed 's/^/  - /'
  echo "Créalos como indica docs/plan/kanban.md (6.3) y vuelve a ejecutar. No se creó nada."
  exit 1
fi

for et in aprendizaje codigo pruebas docs configuracion; do
  gh label create "$et" --force >/dev/null
done

# Hitos (milestones): uno por demo; se crean los que falten
declare -A HITO_EXISTE
while IFS= read -r t; do HITO_EXISTE[$t]=1; done < <(gh api --paginate "repos/{owner}/{repo}/milestones?state=all&per_page=100" --jq '.[].title')
for id in "${IDS[@]}"; do
  h="${HITO[$id]}"
  vacio "$h" && continue
  if [[ -z "${HITO_EXISTE[$h]+x}" ]]; then
    gh api -X POST "repos/{owner}/{repo}/milestones" -f title="$h" >/dev/null
    HITO_EXISTE[$h]=1
    echo "Hito creado: $h"
  fi
done

# Issues que ya existen (para no duplicar si se vuelve a ejecutar): "S1-07 ..." -> número e id
declare -A NUMERO ID_ISSUE
while IFS=$'\t' read -r numero idbd titulo; do
  clave="${titulo%% *}"
  [[ "$clave" =~ ^S[0-9]+-[0-9]+$ ]] && { NUMERO[$clave]="$numero"; ID_ISSUE[$clave]="$idbd"; }
done < <(gh api --paginate "repos/{owner}/{repo}/issues?state=all&per_page=100" \
           --jq '.[] | select(.pull_request | not) | "\(.number)\t\(.id)\t\(.title)"')

editar() { # editar <item> <campo> <flag> <valor>
  gh project item-edit --id "$1" --project-id "$PROYECTO_ID" --field-id "${CAMPO[$2]}" "$3" "$4" >/dev/null
}

# ---------- 3. crear Issues y llenar campos ----------
for id in "${IDS[@]}"; do
  if [[ -n "${NUMERO[$id]+x}" ]]; then
    echo "$id ya existe como #${NUMERO[$id]}: se actualizan sus campos"
    url="$(gh issue view "${NUMERO[$id]}" --json url --jq .url)"
    vacio "${HITO[$id]}" || gh issue edit "${NUMERO[$id]}" --milestone "${HITO[$id]}" >/dev/null
  else
    asignados=()
    IFS=',' read -ra nombres <<< "${DUENOS[$id]}"
    for n in "${nombres[@]}"; do u="$(usuario "$(limpiar "$n")")"; [[ -n "$u" ]] && asignados+=(--assignee "$u"); done
    cuerpo="**ID:** $id
**Tipo:** ${TIPO[$id]}
**Dueño(s) y horas:** ${HORAS[$id]}
**Prioridad:** ${PRIORIDAD[$id]} · ${PRIORITY[$id]} · **Hito:** ${HITO[$id]}

## Criterio de aceptación
${CRITERIO[$id]}

## Depende de
${DEPENDE[$id]} (ver Relationships → Blocked by)"
    hito=(); vacio "${HITO[$id]}" || hito=(--milestone "${HITO[$id]}")
    url="$(gh issue create --title "$id ${TITULO[$id]}" --body "$cuerpo" --label "${TIPO[$id]}" "${asignados[@]}" "${hito[@]}")"
    NUMERO[$id]="${url##*/}"
    ID_ISSUE[$id]="$(gh api "repos/{owner}/{repo}/issues/${NUMERO[$id]}" --jq .id)"
    echo "$id creada como #${NUMERO[$id]}"
    sleep 1   # evita el límite de creación rápida de GitHub
  fi

  item="$(gh project item-add "$GH_PROYECTO" --owner "$GH_PROPIETARIO" --url "$url" --format json --jq .id)"
  editar "$item" "Status"    --single-select-option-id "${OPCION["Status|$(estado_de "$id")"]}"
  editar "$item" "Prioridad" --single-select-option-id "${OPCION["Prioridad|${PRIORIDAD[$id]}"]}"
  editar "$item" "Priority"  --single-select-option-id "${OPCION["Priority|${PRIORITY[$id]}"]}"
  editar "$item" "Sprint"    --iteration-id "${ITERACION["Sprint|$SPRINT"]}"
  vacio "${SIZE[$id]}"     || editar "$item" "Size"        --single-select-option-id "${OPCION["Size|${SIZE[$id]}"]}"
  vacio "${ESTIMATE[$id]}" || editar "$item" "Estimate"    --number "${ESTIMATE[$id]//,/.}"
  vacio "${INICIO[$id]}"   || editar "$item" "Start date"  --date "${INICIO[$id]}"
  vacio "${FIN[$id]}"      || editar "$item" "Target date" --date "${FIN[$id]}"
done

# ---------- 4. relaciones "Blocked by" ----------
for id in "${IDS[@]}"; do
  vacio "${DEPENDE[$id]}" && continue
  IFS=',' read -ra deps <<< "${DEPENDE[$id]}"
  for d in "${deps[@]}"; do
    d="$(limpiar "$d")"
    if gh api -X POST "repos/{owner}/{repo}/issues/${NUMERO[$id]}/dependencies/blocked_by" \
         -F issue_id="${ID_ISSUE[$d]}" >/dev/null 2>&1; then
      echo "$id (#${NUMERO[$id]}) bloqueada por $d (#${NUMERO[$d]})"
    else
      echo "Aviso: no se creó '$id bloqueada por $d' (puede que ya exista)"
    fi
  done
done

echo "Listo: ${#IDS[@]} tarjetas en el proyecto $GH_PROYECTO ($SPRINT)."
echo "Revisa el tablero: S1-00 se mueve a mano a In Review hasta que Miguel la revise; al empezar cada fase, sus tarjetas pasan de Backlog a Ready."
