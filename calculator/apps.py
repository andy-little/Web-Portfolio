from django.apps import AppConfig


class CalculatorConfig(AppConfig):
    name = 'calculator'

    def ready(self):
        import calculator.signals
