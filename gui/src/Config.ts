const env = process.env;

export default class Config {
  public static PLACEHOLDER_SEARCH_ID: string;
  public static OWNER: string;
  public static ANNOTATION_HOST: string;
  public static TEXT_HOST: string;
  static ELUCIDATE_HOST: string;

  public static init() {
    for (const key of Object.keys(this)) {
      (this as any)[key] = this.setEnvVar(env, key);
    }
  }

  private static setEnvVar(env: any, key: string): string {
    // See: https://create-react-app.dev/docs/adding-custom-environment-variables/
    let fullEnvVar = 'REACT_APP_' + key;

    let value: string | undefined = env[fullEnvVar];
    if (!value) {
      throw Error(`environment variable ${fullEnvVar} is not set`);
    }
    return value;
  }

}

Config.init();
