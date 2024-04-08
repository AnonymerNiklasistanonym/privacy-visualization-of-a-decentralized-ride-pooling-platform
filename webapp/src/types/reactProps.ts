export interface DefaultProps {
  children?: React.ReactNode;
}
export interface DefaultPropsI18n extends DefaultProps {
  locale: string;
}

export interface DefaultPropsI18nHome {
  params: {
    locale: string;
  };
}

export interface DefaultPropsI18nRoot
  extends DefaultProps,
    DefaultPropsI18nHome {}
