import { ExtensionContext, workspace, commands } from 'coc.nvim';
import { ExtensionAPI } from './extension.api';

let serverStatus: 'Starting' | 'Started' | 'Error' = 'Starting'

const VM_ARGS_KEY = "jdt.ls.vmargs"

async function updateVmArgs(value: string) {
  const config = workspace.getConfiguration('java')
  config.update(VM_ARGS_KEY, value)
}

export async function activate(context: ExtensionContext): Promise<ExtensionAPI> {
  let javaConfig = workspace.getConfiguration('java')
  if (!javaConfig.get<boolean>('enabled', true)) return

  const javaAgentArg = `-javaagent:"${context.asAbsolutePath("jar/lombok.jar")}"`

  const vmArgs: string | undefined = javaConfig.get(VM_ARGS_KEY)
  if (!vmArgs) {
    await updateVmArgs(javaAgentArg)
  } else if (!vmArgs.match(/-javaagent:".*"/)) {
    await updateVmArgs(vmArgs.trim() + ' ' + javaAgentArg)
  } else if (!vmArgs.includes(javaAgentArg)) {
    await updateVmArgs(vmArgs.replace(/-javaagent:".*"/, javaAgentArg))
  }

  let info: ExtensionAPI = {
    apiVersion: '0.1',
    get status(): any {
      return serverStatus
    }
  }

  return info
}
