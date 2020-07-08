export interface ExtensionAPI {
  readonly apiVersion: string
  readonly status: "Starting" | "Started" | "Error"
}
