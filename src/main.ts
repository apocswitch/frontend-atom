import { bootstrapApplication } from "@angular/platform-browser";

import { AppComponent } from "./app/app.component";
import { appConfig } from "./app/app.config";
import { provideHttpClient, withInterceptors } from "@angular/common/http";
import { authInterceptor } from "./app/interceptors/auth.interceptor";
import { provideServiceWorker } from "@angular/service-worker";
import { environment } from "./environments/environment";

bootstrapApplication(AppComponent, {
    ...appConfig,
    providers: [
      provideHttpClient(withInterceptors([authInterceptor])),
      ...(appConfig.providers || []),
      environment.production ? provideServiceWorker("ngsw-config.json") : [],
    ]
  }).catch((err) => console.error(err));