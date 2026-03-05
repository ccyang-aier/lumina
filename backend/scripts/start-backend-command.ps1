param(
  [Parameter(Mandatory = $true, Position = 0)]
  [string]$Cmd
)

# WSL里的conda初始化脚本
$CondaInit = "source /home/miniforge3/etc/profile.d/conda.sh"

# conda环境名
$EnvName = "box"

# lumina后端目录
$BackendDir = "/mnt/c/AIWorks/Lumina/lumina/backend"

# 组合成WSL内部要执行的一串命令
# 注意：用 bash -lc 以确保 profile/conda 初始化在非交互 shell 中也生效
$Inner = "$CondaInit && conda activate $EnvName && cd $BackendDir && $Cmd"

# 执行
wsl -e bash -lc $Inner
