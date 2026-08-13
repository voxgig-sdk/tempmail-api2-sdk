# TempmailApi2 SDK utility: make_context

from projectname_sdk.core.context import TempmailApi2Context


def make_context_util(ctxmap, basectx):
    return TempmailApi2Context(ctxmap, basectx)
