# TempmailApi2 SDK feature factory

from feature.base_feature import TempmailApi2BaseFeature
from feature.test_feature import TempmailApi2TestFeature


def _make_feature(name):
    features = {
        "base": lambda: TempmailApi2BaseFeature(),
        "test": lambda: TempmailApi2TestFeature(),
    }
    factory = features.get(name)
    if factory is not None:
        return factory()
    return features["base"]()
