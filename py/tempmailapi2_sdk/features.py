# TempmailApi2 SDK feature factory

from tempmailapi2_sdk.feature.base_feature import TempmailApi2BaseFeature
from tempmailapi2_sdk.feature.ratelimit_feature import TempmailApi2RatelimitFeature
from tempmailapi2_sdk.feature.retry_feature import TempmailApi2RetryFeature
from tempmailapi2_sdk.feature.test_feature import TempmailApi2TestFeature
from tempmailapi2_sdk.feature.timeout_feature import TempmailApi2TimeoutFeature


_FEATURES = {
    "base": lambda: TempmailApi2BaseFeature(),
    "ratelimit": lambda: TempmailApi2RatelimitFeature(),
    "retry": lambda: TempmailApi2RetryFeature(),
    "test": lambda: TempmailApi2TestFeature(),
    "timeout": lambda: TempmailApi2TimeoutFeature(),
}


def _make_feature(name):
    factory = _FEATURES.get(name)
    if factory is not None:
        return factory()
    return _FEATURES["base"]()


# True when this SDK was generated with the named feature class - the
# constructor's tolerance for extend-carried features reads this (an
# active name with no generated class must not become a BaseFeature
# stray when an extend instance carries it).
def _has_feature(name):
    return name in _FEATURES
