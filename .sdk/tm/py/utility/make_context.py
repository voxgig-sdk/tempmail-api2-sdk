# TempmailApi2 SDK utility: make_context

from core.context import TempmailApi2Context


def make_context_util(ctxmap, basectx):
    return TempmailApi2Context(ctxmap, basectx)
