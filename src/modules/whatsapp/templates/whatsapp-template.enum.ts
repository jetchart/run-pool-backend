export enum WhatsappTemplate {
  TRIP_CREATED = "🚗 ¡Genial {name}! Tu viaje del día {tripDate} para la carrera {raceName} está listo. ¡A preparar la valija! 🏁. Para mas info entrá en {tripUrl}",
  TRIP_CONFIRMED = "✅ ¡Confirmado {name}! Tu viaje del día {tripDate} para la carrera {raceName} está en marcha. ¡Nos vemos en la ruta! 😎. Para mas info entrá en {tripUrl}",
  TRIP_JOIN = "🙋‍♂️ ¡Atención {name}! {passengerName} quiere sumarse a tu viaje para la carrera {raceName}. ¿Lo subimos? 🏃‍♂️🚗. Para mas info entrá en {tripUrl}",
  TRIP_REJECTED = "😔 ¡Uy {name}! El conductor no aceptó tu postulación para el viaje a la carrera {raceName}. ¡No te desanimes! 💪. Para buscar otro viaje entrá en {racepUrl}",
  TRIP_LEAVED = "👋 ¡Ojo {name}! El pasajero {passengerName} se bajó de tu viaje a la carrera {raceName}. . Para mas info entrá en {tripUrl} ",
}
